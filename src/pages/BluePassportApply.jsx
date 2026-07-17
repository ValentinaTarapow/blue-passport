import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import LoadingState from '../components/LoadingState';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { CONTACT_EMAIL } from '../utils/constants';
import { useProfessionalCategories } from '../hooks/useWordPress';
import { APPLICATION_STATUS, EMPTY_APPLICATION } from '../utils/applicationFields';
import { getPlanById, resolveApplicationPlan } from '../utils/bluePassportPlans';
import { isValidPartnerCode, normalizePartnerCode } from '../utils/partnerDiscountCodes';
import {
  createApplication,
  setCheckoutApplicationId,
  updateApplication,
} from '../services/applicationStorage';
import { buildStripePaymentUrl } from '../services/stripeCheckout';
import { buildCategoryCheckboxOptions, filterCategoryCheckboxOptions, toggleCategoryIds } from '../utils/search';
import { readProfileImageFile } from '../utils/profileImage';
import {
  MAX_DOCUMENTS,
  readApplicationDocument,
} from '../utils/applicationDocuments';
import {
  FormPage,
  FormHero,
  FormEyebrow,
  FormTitle,
  FormLead,
  FormShell,
  FormCard,
  WizardSteps,
  WizardStep,
  Form,
  FieldRow,
  FieldGroup,
  Label,
  RequiredMark,
  Input,
  FileInput,
  Textarea,
  CheckboxGrid,
  CheckboxPanel,
  CheckboxSearch,
  CheckboxOption,
  FieldHint,
  FieldError,
  FieldSuccess,
  DiscountCodeRow,
  PhotoPreview,
  FileList,
  PricingSection,
  PricingSelection,
  PricingTotalLabel,
  PricingTotalAmount,
  PricingTotalPeriod,
  PricingTotalNote,
  PricingIncludes,
  PricingReference,
  PricingReferenceList,
  Actions,
  Note,
  ReviewNote,
} from './BluePassportForm.styles';

const STEPS = ['apply', 'pay', 'done'];

export default function BluePassportApply() {
  const { t } = useTranslation();
  const a = t.bluePassport.apply;
  const { data: categories = [], isLoading: categoriesLoading } = useProfessionalCategories();
  const categoryOptions = useMemo(
    () => buildCategoryCheckboxOptions(categories),
    [categories],
  );
  const [form, setForm] = useState({ ...EMPTY_APPLICATION });
  const [profileImage, setProfileImage] = useState(null);
  const [accreditationDocuments, setAccreditationDocuments] = useState([]);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [profileImageError, setProfileImageError] = useState('');
  const [documentsError, setDocumentsError] = useState('');
  const [partnerCodeError, setPartnerCodeError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const partnerCodeActive = useMemo(
    () => partnerCodeInput.trim() && isValidPartnerCode(partnerCodeInput),
    [partnerCodeInput],
  );

  const activePlanId = useMemo(
    () =>
      resolveApplicationPlan({
        hasProtocolTraining: form.hasProtocolTraining,
      }),
    [form.hasProtocolTraining],
  );
  const pricingSummary = a.pricing.summaries[activePlanId];

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

  const toggleProtocolTraining = () => {
    setForm((current) => ({
      ...current,
      hasProtocolTraining: !current.hasProtocolTraining,
    }));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setProfileImage(null);
      return;
    }

    try {
      const image = await readProfileImageFile(file);
      setProfileImage(image);
      setProfileImageError('');
    } catch (error) {
      setProfileImage(null);
      if (error.message === 'tooLarge') {
        setProfileImageError(a.profilePhotoTooLarge);
      } else if (error.message === 'invalidType') {
        setProfileImageError(a.profilePhotoInvalidType);
      } else {
        setProfileImageError(a.profilePhotoReadError);
      }
    }
  };

  const handleDocumentsChange = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) return;

    if (accreditationDocuments.length + files.length > MAX_DOCUMENTS) {
      setDocumentsError(a.documentsTooMany.replace('{max}', String(MAX_DOCUMENTS)));
      return;
    }

    try {
      const nextDocuments = [...accreditationDocuments];
      for (const file of files) {
        nextDocuments.push(await readApplicationDocument(file));
      }
      setAccreditationDocuments(nextDocuments);
      setDocumentsError('');
    } catch (error) {
      if (error.message === 'tooLarge') {
        setDocumentsError(a.documentsTooLarge);
      } else if (error.message === 'invalidType') {
        setDocumentsError(a.documentsInvalidType);
      } else {
        setDocumentsError(a.documentsReadError);
      }
    }
  };

  const removeDocument = (index) => {
    setAccreditationDocuments((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setDocumentsError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPaymentError('');
    setPartnerCodeError('');

    if (form.categoryIds.length === 0) {
      setCategoryError(a.categoriesRequired);
      return;
    }

    if (!profileImage) {
      setProfileImageError(a.profilePhotoRequired);
      return;
    }

    if (accreditationDocuments.length === 0) {
      setDocumentsError(a.documentsRequired);
      return;
    }

    if (partnerCodeInput.trim() && !isValidPartnerCode(partnerCodeInput)) {
      setPartnerCodeError(a.discountCodeInvalid);
      return;
    }

    const partnerCode = partnerCodeActive ? normalizePartnerCode(partnerCodeInput) : '';
    const planId = resolveApplicationPlan({
      hasProtocolTraining: form.hasProtocolTraining,
    });
    const application = createApplication({
      ...form,
      planId,
      partnerCode,
      profileImage,
      accreditationDocuments,
    });
    updateApplication(application.id, { status: APPLICATION_STATUS.PENDING_PAYMENT });

    const stripeLink = getPlanById(planId).stripePaymentLink;
    const stripeUrl = buildStripePaymentUrl(stripeLink, application);

    if (!stripeUrl) {
      setPaymentError(a.missingLink);
      return;
    }

    setCheckoutApplicationId(application.id);
    window.location.href = stripeUrl;
  };

  return (
    <PageTransition>
      <FormPage>
        <FormHero>
          <FormEyebrow>{a.eyebrow}</FormEyebrow>
          <FormTitle>{a.title}</FormTitle>
          <FormLead>{a.lead}</FormLead>
        </FormHero>

        <FormShell>
          <WizardSteps>
            {STEPS.map((step, index) => (
              <WizardStep key={step} $active={index === 0} $done={false}>
                {t.bluePassport.wizard[step]}
              </WizardStep>
            ))}
          </WizardSteps>

          <FormCard>
            {categoriesLoading ? (
              <LoadingState message={a.categoriesLoading} />
            ) : (
              <Form onSubmit={handleSubmit}>
                <FieldRow>
                  <FieldGroup>
                    <Label htmlFor="bp-fullName">
                      {a.fields.fullName} <RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      id="bp-fullName"
                      required
                      value={form.fullName}
                      onChange={update('fullName')}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="bp-company">{a.fields.company}</Label>
                    <Input id="bp-company" value={form.company} onChange={update('company')} />
                  </FieldGroup>
                </FieldRow>

                <FieldRow>
                  <FieldGroup>
                    <Label htmlFor="bp-email">
                      {a.fields.email} <RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      id="bp-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update('email')}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="bp-phone">
                      {a.fields.phone} <RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      id="bp-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={update('phone')}
                    />
                  </FieldGroup>
                </FieldRow>

                <FieldGroup>
                  <Label>
                    {a.fields.category} <RequiredMark>*</RequiredMark>
                  </Label>
                  <FieldHint>{a.categoriesHint}</FieldHint>
                  {categoryOptions.length > 0 ? (
                    <CheckboxPanel>
                      <CheckboxSearch
                        type="search"
                        value={categorySearch}
                        onChange={(event) => setCategorySearch(event.target.value)}
                        placeholder={a.categoriesSearch}
                        aria-label={a.categoriesSearch}
                      />
                      <CheckboxGrid>
                        {filteredCategoryOptions.length > 0 ? (
                          filteredCategoryOptions.map((option) => {
                            const checked = form.categoryIds.includes(option.id);
                            return (
                              <CheckboxOption
                                key={option.id}
                                $isChild={option.isChild}
                                $checked={checked}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleCategory(option.id)}
                                />
                                <span>{option.label}</span>
                              </CheckboxOption>
                            );
                          })
                        ) : (
                          <FieldHint>{a.categoriesNoResults}</FieldHint>
                        )}
                      </CheckboxGrid>
                    </CheckboxPanel>
                  ) : (
                    <FieldHint>{a.categoriesEmpty}</FieldHint>
                  )}
                  {categoryError && <FieldError>{categoryError}</FieldError>}
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-location">
                    {a.fields.location} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    id="bp-location"
                    required
                    value={form.location}
                    onChange={update('location')}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-shortDescription">
                    {a.fields.shortDescription} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Textarea
                    id="bp-shortDescription"
                    required
                    maxLength={280}
                    value={form.shortDescription}
                    onChange={update('shortDescription')}
                    placeholder={a.placeholders.shortDescription}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-bio">
                    {a.fields.biography} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Textarea
                    id="bp-bio"
                    required
                    value={form.biography}
                    onChange={update('biography')}
                    placeholder={a.placeholders.biography}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-photo">
                    {a.fields.profilePhoto} <RequiredMark>*</RequiredMark>
                  </Label>
                  <FieldHint>{a.profilePhotoHint}</FieldHint>
                  <FileInput
                    id="bp-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                  />
                  {profileImage && (
                    <PhotoPreview>
                      <img src={profileImage.dataUrl} alt={a.profilePhotoPreviewAlt} />
                    </PhotoPreview>
                  )}
                  {profileImageError && <FieldError>{profileImageError}</FieldError>}
                </FieldGroup>

                <FieldGroup>
                  <Label>{a.protocolSectionLabel}</Label>
                  <FieldHint>{a.protocolRequirementNote}</FieldHint>
                  <CheckboxOption $checked={form.hasProtocolTraining}>
                    <input
                      type="checkbox"
                      checked={form.hasProtocolTraining}
                      onChange={toggleProtocolTraining}
                    />
                    <span>{a.fields.protocolAccreditation}</span>
                  </CheckboxOption>
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-partner-code">{a.discountCodeLabel}</Label>
                  <FieldHint>{a.discountCodeHint}</FieldHint>
                  <DiscountCodeRow>
                    <Input
                      id="bp-partner-code"
                      value={partnerCodeInput}
                      onChange={(event) => {
                        setPartnerCodeInput(event.target.value);
                        setPartnerCodeError('');
                      }}
                      placeholder={a.discountCodePlaceholder}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </DiscountCodeRow>
                  {partnerCodeActive && (
                    <FieldSuccess>
                      {a.partnerCodeApplied.replace(
                        '{code}',
                        normalizePartnerCode(partnerCodeInput),
                      )}
                    </FieldSuccess>
                  )}
                  {partnerCodeError && <FieldError>{partnerCodeError}</FieldError>}
                </FieldGroup>

                <FieldGroup>
                  <Label>{a.pricing.title}</Label>
                  <PricingSection>
                    <PricingSelection>
                      <PricingTotalLabel>{a.pricing.payLabel}</PricingTotalLabel>
                      <PricingTotalAmount>
                        {pricingSummary.total}
                        <PricingTotalPeriod> {a.pricing.period}</PricingTotalPeriod>
                      </PricingTotalAmount>
                      <PricingTotalNote>{pricingSummary.singlePaymentNote}</PricingTotalNote>
                      <PricingIncludes>
                        {pricingSummary.includes.map((item) => (
                          <li key={item}>✓ {item}</li>
                        ))}
                      </PricingIncludes>
                      {pricingSummary.referenceNote && (
                        <PricingReference>{pricingSummary.referenceNote}</PricingReference>
                      )}
                    </PricingSelection>

                    <FieldHint>{a.pricing.referenceIntro}</FieldHint>
                    <PricingReferenceList>
                      {a.pricing.referenceItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </PricingReferenceList>
                  </PricingSection>
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-documents">
                    {a.fields.accreditationDocuments} <RequiredMark>*</RequiredMark>
                  </Label>
                  <FieldHint>
                    {form.hasProtocolTraining
                      ? a.documentsHintWithProtocol
                      : a.documentsHintWithoutProtocol}
                  </FieldHint>
                  <FileInput
                    id="bp-documents"
                    type="file"
                    multiple
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    onChange={handleDocumentsChange}
                  />
                  {accreditationDocuments.length > 0 && (
                    <FileList>
                      {accreditationDocuments.map((document, index) => (
                        <li key={`${document.fileName}-${index}`}>
                          <span>{document.fileName}</span>
                          <button type="button" onClick={() => removeDocument(index)}>
                            {a.removeDocument}
                          </button>
                        </li>
                      ))}
                    </FileList>
                  )}
                  {documentsError && <FieldError>{documentsError}</FieldError>}
                </FieldGroup>

                <FieldRow>
                  <FieldGroup>
                    <Label htmlFor="bp-website">{a.fields.website}</Label>
                    <Input
                      id="bp-website"
                      type="url"
                      placeholder="https://"
                      value={form.website}
                      onChange={update('website')}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="bp-linkedin">{a.fields.linkedin}</Label>
                    <Input
                      id="bp-linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={form.linkedin}
                      onChange={update('linkedin')}
                    />
                  </FieldGroup>
                </FieldRow>

                <FieldGroup>
                  <Label htmlFor="bp-certs">{a.fields.certifications}</Label>
                  <Textarea
                    id="bp-certs"
                    value={form.certifications}
                    onChange={update('certifications')}
                    placeholder={a.placeholders.certifications}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="bp-notes">{a.fields.additionalNotes}</Label>
                  <Textarea
                    id="bp-notes"
                    value={form.additionalNotes}
                    onChange={update('additionalNotes')}
                  />
                </FieldGroup>

                <ReviewNote>{t.bluePassport.reviewNote}</ReviewNote>

                <Actions>
                  {paymentError ? (
                    <Button href={`mailto:${CONTACT_EMAIL}`} variant="primary" size="lg">
                      {a.missingLinkCta}
                    </Button>
                  ) : (
                    <Button type="submit" variant="primary" size="lg">
                      {a.submit}
                    </Button>
                  )}
                  <Button as={Link} to="/blue-passport" variant="outline" size="lg">
                    {a.back}
                  </Button>
                </Actions>
                {paymentError && <FieldError>{paymentError}</FieldError>}
                <Note>{a.note}</Note>
              </Form>
            )}
          </FormCard>
        </FormShell>
      </FormPage>
    </PageTransition>
  );
}
