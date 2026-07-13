/** Application lifecycle — manual publish in Directorist after admin review. */
export const APPLICATION_STATUS = {
  DRAFT: 'draft',
  PENDING_PAYMENT: 'pending_payment',
  PAID_PENDING_REVIEW: 'paid_pending_review',
  PUBLISHED: 'published',
};

export const APPLICATION_FIELDS = [
  'fullName',
  'email',
  'phone',
  'company',
  'categoryIds',
  'location',
  'shortDescription',
  'hasProtocolTraining',
  'planId',
  'partnerCode',
  'profileImage',
  'accreditationDocuments',
  'biography',
  'website',
  'linkedin',
  'certifications',
  'additionalNotes',
];

export const EMPTY_APPLICATION = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  categoryIds: [],
  location: '',
  shortDescription: '',
  hasProtocolTraining: false,
  planId: 'annual_protocol',
  partnerCode: '',
  profileImage: null,
  accreditationDocuments: [],
  biography: '',
  website: '',
  linkedin: '',
  certifications: '',
  additionalNotes: '',
};
