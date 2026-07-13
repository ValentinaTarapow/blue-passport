import { CONTACT_EMAIL } from '../utils/constants';
import { formatDocumentList } from '../utils/applicationDocuments';
import { resolveCategoryLabels } from '../utils/search';

export function notifyTeamByEmail({ subject, body }) {
  const params = new URLSearchParams({
    subject,
    body,
  });
  window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export function formatApplicationCategories(application, categories = []) {
  const fromIds = resolveCategoryLabels(application.categoryIds, categories);
  if (fromIds) return fromIds;
  if (application.category) return application.category;
  return '—';
}

export function formatApplicationEmailBody(application, labels, categories = []) {
  const lines = [
    `${labels.applicationId}: ${application.id}`,
    `${labels.status}: ${application.status}`,
    '',
    `${labels.fullName}: ${application.fullName}`,
    `${labels.email}: ${application.email}`,
    `${labels.phone}: ${application.phone}`,
  ];

  if (application.company) lines.push(`${labels.company}: ${application.company}`);
  lines.push(
    `${labels.category}: ${formatApplicationCategories(application, categories)}`,
    `${labels.location}: ${application.location}`,
    `${labels.protocolTraining}: ${
      application.hasProtocolTraining ? labels.yes : labels.no
    }`,
    `${labels.plan}: ${application.planId}`,
  );
  if (application.partnerCode) {
    lines.push(`${labels.partnerCode}: ${application.partnerCode}`);
  }
  lines.push(
    '',
    `${labels.profilePhoto}: ${application.profileImage?.fileName || '—'}`,
    labels.profilePhotoAttachNote,
    '',
    `${labels.documents}: ${formatDocumentList(application.accreditationDocuments)}`,
    labels.documentsAttachNote,
    '',
    `${labels.shortDescription}:`,
    application.shortDescription,
    '',
    `${labels.website}: ${application.website || '—'}`,
    `${labels.linkedin}: ${application.linkedin || '—'}`,
    '',
    `${labels.biography}:`,
    application.biography || '—',
    '',
    `${labels.certifications}:`,
    application.certifications || '—',
    '',
    `${labels.additionalNotes}:`,
    application.additionalNotes || '—',
  );

  return lines.join('\n');
}
