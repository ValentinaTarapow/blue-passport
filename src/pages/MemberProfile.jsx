import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import LoadingState from '../components/LoadingState';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { useProfessionalCategories } from '../hooks/useWordPress';
import { getApplication, getCheckoutSession, publishDirectoristDraft, submitProfile } from '../services/api';
import { buildCategoryCheckboxOptions, filterCategoryCheckboxOptions, toggleCategoryIds } from '../utils/search';
import { readProfileImageFile } from '../utils/profileImage';
import { MAX_DOCUMENTS, readApplicationDocument } from '../utils/applicationDocuments';
import {
  FormPage,
  FormHero,
  FormEyebrow,
  FormTitle,
  FormLead,
  FormShell,
  FormCard,
  Form,
  FieldRow,
  FieldGroup,
  Label,
  RequiredMark,
  Input,
  FileInput,
  Textarea,
  CheckboxGrid,
  CheckboxSearch,
  CheckboxOption,
  FieldHint,
  FieldError,
  PhotoPreview,
  FileList,
  Actions,
  Note,
  ReviewNote,
} from './BluePassportForm.styles';

const EMPTY_PROFILE = {
  phone: '',
  whatsapp: '',
  languages: '',
  services: '',
  shortDescription: '',
  biography: '',
  website: '',
  linkedin: '',
  certifications: '',
  additionalNotes: '',
  categoryIds: [],
  location: '',
  locationIds: [],
};

export default function MemberProfile() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const applicationIdParam = searchParams.get('applicationId');
  const [resolvedApplicationId, setResolvedApplicationId] = useState(applicationIdParam || '');
  const { t } = useTranslation();
  const p = t.bluePassport.profile;
  const { data: categories = [], isLoading: categoriesLoading } = useProfessionalCategories();
  const categoryOptions = useMemo(
    () => buildCategoryCheckboxOptions(categories),
    [categories],
  );

  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [form, setForm] = useState({ ...EMPTY_PROFILE });
  const [profileImage, setProfileImage] = useState(null);
  const [accreditationDocuments, setAccreditationDocuments] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [profileImageError, setProfileImageError] = useState('');
  const [documentsError, setDocumentsError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [wordpressListingId, setWordpressListingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (applicationIdParam) {
        setResolvedApplicationId(applicationIdParam);
        return;
      }

      if (sessionId) {
        try {
          const session = await getCheckoutSession(sessionId);
          if (!cancelled) {
            setResolvedApplicationId(session.applicationId);
          }
        } catch {
          if (!cancelled) {
            setBootError(p.loadError);
            setBootLoading(false);
          }
        }
        return;
      }

      setBootError(p.missingApplication);
      setBootLoading(false);
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, [applicationIdParam, sessionId, p.loadError, p.missingApplication]);

  useEffect(() => {
    if (!resolvedApplicationId) return;

    getApplication(resolvedApplicationId)
      .then((application) => {
        setApplicantName(application.fullName);
        if (application.profile) {
          setForm({ ...EMPTY_PROFILE, ...application.profile });
        }
        if (application.wordpressListingId) {
          setCompleted(true);
          setWordpressListingId(application.wordpressListingId);
        }
      })
      .catch(() => setBootError(p.loadError))
      .finally(() => setBootLoading(false));
  }, [resolvedApplicationId, p.loadError, p.missingApplication]);

  const applicationId = resolvedApplicationId;

  const filteredCategoryOptions = useMemo(
    () => filterCategoryCheckboxOptions(categoryOptions, categories, categorySearch),
    [categoryOptions, categories, categorySearch],
  );

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const toggleCategory = (categoryId) => {
    setCategoryError('');
    setForm((current) => ({
      ...current,
      categoryIds: toggleCategoryIds(current.categoryIds, categoryId, categories),
    }));
  };

  const handlePhotoChange = async (event) => {
    setProfileImageError('');
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await readProfileImageFile(file, {
        tooLarge: p.profilePhotoTooLarge,
        invalidType: p.profilePhotoInvalidType,
        readError: p.profilePhotoReadError,
      });
      setProfileImage(image);
    } catch (error) {
      setProfileImageError(error.message);
    }
  };

  const handleDocumentsChange = async (event) => {
    setDocumentsError('');
    const files = Array.from(event.target.files || []);

    if (files.length + accreditationDocuments.length > MAX_DOCUMENTS) {
      setDocumentsError(p.documentsTooMany.replace('{max}', String(MAX_DOCUMENTS)));
      return;
    }

    try {
      const documents = await Promise.all(
        files.map((file) =>
          readApplicationDocument(file, {
            tooLarge: p.documentsTooLarge,
            invalidType: p.documentsInvalidType,
            readError: p.documentsReadError,
          }),
        ),
      );
      setAccreditationDocuments((current) => [...current, ...documents]);
    } catch (error) {
      setDocumentsError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!form.categoryIds.length) {
      setCategoryError(p.categoriesRequired);
      return;
    }

    if (!profileImage) {
      setProfileImageError(p.profilePhotoRequired);
      return;
    }

    if (!form.biography.trim() || !form.shortDescription.trim()) {
      setSubmitError(p.requiredError);
      return;
    }

    setSubmitting(true);

    try {
      await submitProfile(applicationId, {
        ...form,
        profileImageName: profileImage.fileName,
        documentNames: accreditationDocuments.map((document) => document.fileName),
      });

      try {
        const draft = await publishDirectoristDraft(applicationId);
        setWordpressListingId(draft.wordpressListingId);
      } catch {
        // Profile is saved even if WordPress draft creation is not configured yet.
      }

      setCompleted(true);
    } catch (error) {
      setSubmitError(error.message || p.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  if (bootLoading) {
    return <LoadingState fullPage message={p.loading} />;
  }

  if (bootError) {
    return (
      <PageTransition>
        <FormPage>
          <FormShell>
            <FormCard>
              <FieldError>{bootError}</FieldError>
              <Actions>
                <Button to="/blue-passport/become-a-member" variant="primary">
                  {p.backCta}
                </Button>
              </Actions>
            </FormCard>
          </FormShell>
        </FormPage>
      </PageTransition>
    );
  }

  if (completed) {
    return (
      <PageTransition>
        <FormPage>
          <FormHero>
            <FormTitle>{p.successTitle}</FormTitle>
            <FormLead>{p.successLead}</FormLead>
          </FormHero>
          <FormShell>
            <FormCard>
              {wordpressListingId && (
                <ReviewNote>
                  {p.draftNote.replace('{id}', String(wordpressListingId))}
                </ReviewNote>
              )}
              <ReviewNote>{t.bluePassport.reviewNote}</ReviewNote>
              <Actions>
                <Button to="/blue-passport" variant="primary" size="lg">
                  {p.homeCta}
                </Button>
              </Actions>
            </FormCard>
          </FormShell>
        </FormPage>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <FormPage>
        <FormHero>
          <FormEyebrow>{p.eyebrow}</FormEyebrow>
          <FormTitle>{p.title}</FormTitle>
          <FormLead>{p.lead.replace('{name}', applicantName)}</FormLead>
        </FormHero>

        <FormShell>
          <FormCard>
            <Form onSubmit={handleSubmit}>
              <FieldGroup>
                <Label htmlFor="profile-photo">
                  {p.fields.profilePhoto} <RequiredMark>*</RequiredMark>
                </Label>
                <FieldHint>{p.profilePhotoHint}</FieldHint>
                <FileInput
                  id="profile-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                />
                {profileImage && (
                  <PhotoPreview>
                    <img src={profileImage.dataUrl} alt={p.profilePhotoPreviewAlt} />
                  </PhotoPreview>
                )}
                {profileImageError && <FieldError>{profileImageError}</FieldError>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="profile-bio">
                  {p.fields.biography} <RequiredMark>*</RequiredMark>
                </Label>
                <Textarea
                  id="profile-bio"
                  required
                  value={form.biography}
                  onChange={update('biography')}
                  placeholder={p.placeholders.biography}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="profile-short">
                  {p.fields.shortDescription} <RequiredMark>*</RequiredMark>
                </Label>
                <Textarea
                  id="profile-short"
                  required
                  maxLength={280}
                  value={form.shortDescription}
                  onChange={update('shortDescription')}
                  placeholder={p.placeholders.shortDescription}
                />
              </FieldGroup>

              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="profile-website">{p.fields.website}</Label>
                  <Input id="profile-website" value={form.website} onChange={update('website')} />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="profile-linkedin">{p.fields.linkedin}</Label>
                  <Input id="profile-linkedin" value={form.linkedin} onChange={update('linkedin')} />
                </FieldGroup>
              </FieldRow>

              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="profile-whatsapp">{p.fields.whatsapp}</Label>
                  <Input id="profile-whatsapp" value={form.whatsapp} onChange={update('whatsapp')} />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="profile-phone">{p.fields.phone}</Label>
                  <Input id="profile-phone" value={form.phone} onChange={update('phone')} />
                </FieldGroup>
              </FieldRow>

              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="profile-languages">{p.fields.languages}</Label>
                  <Input
                    id="profile-languages"
                    value={form.languages}
                    onChange={update('languages')}
                    placeholder={p.placeholders.languages}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="profile-services">{p.fields.services}</Label>
                  <Input
                    id="profile-services"
                    value={form.services}
                    onChange={update('services')}
                    placeholder={p.placeholders.services}
                  />
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <Label htmlFor="profile-location">{p.fields.location}</Label>
                <Input id="profile-location" value={form.location} onChange={update('location')} />
              </FieldGroup>

              <FieldGroup>
                <Label>{p.fields.categories}</Label>
                <FieldHint>{p.categoriesHint}</FieldHint>
                {categoriesLoading ? (
                  <FieldHint>{p.categoriesLoading}</FieldHint>
                ) : (
                  <>
                    <CheckboxSearch
                      value={categorySearch}
                      onChange={(event) => setCategorySearch(event.target.value)}
                      placeholder={p.categoriesSearch}
                    />
                    <CheckboxGrid>
                      {filteredCategoryOptions.map((option) => (
                        <CheckboxOption
                          key={option.id}
                          $checked={form.categoryIds.includes(option.id)}
                        >
                          <input
                            type="checkbox"
                            checked={form.categoryIds.includes(option.id)}
                            onChange={() => toggleCategory(option.id)}
                          />
                          <span>{option.label}</span>
                        </CheckboxOption>
                      ))}
                    </CheckboxGrid>
                  </>
                )}
                {categoryError && <FieldError>{categoryError}</FieldError>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="profile-certifications">{p.fields.certifications}</Label>
                <Textarea
                  id="profile-certifications"
                  value={form.certifications}
                  onChange={update('certifications')}
                  placeholder={p.placeholders.certifications}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="profile-documents">{p.fields.documents}</Label>
                <FieldHint>{p.documentsHint}</FieldHint>
                <FileInput
                  id="profile-documents"
                  type="file"
                  multiple
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleDocumentsChange}
                />
                {accreditationDocuments.length > 0 && (
                  <FileList>
                    {accreditationDocuments.map((document, index) => (
                      <li key={`${document.fileName}-${index}`}>{document.fileName}</li>
                    ))}
                  </FileList>
                )}
                {documentsError && <FieldError>{documentsError}</FieldError>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="profile-notes">{p.fields.additionalNotes}</Label>
                <Textarea
                  id="profile-notes"
                  value={form.additionalNotes}
                  onChange={update('additionalNotes')}
                />
              </FieldGroup>

              {submitError && <FieldError>{submitError}</FieldError>}

              <Actions>
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                  {submitting ? p.submitting : p.submit}
                </Button>
              </Actions>

              <Note>{p.note}</Note>
            </Form>
          </FormCard>
        </FormShell>
      </FormPage>
    </PageTransition>
  );
}
