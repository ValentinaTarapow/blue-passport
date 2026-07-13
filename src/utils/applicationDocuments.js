export const MAX_DOCUMENTS = 3;
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export async function readApplicationDocument(file) {
  if (!file) {
    throw new Error('missing');
  }

  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error('invalidType');
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error('tooLarge');
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('readFailed'));
    reader.readAsDataURL(file);
  });

  return {
    dataUrl,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export function downloadApplicationFile(file, fallbackName = 'document') {
  if (!file?.dataUrl) return;

  const link = document.createElement('a');
  link.href = file.dataUrl;
  link.download = file.fileName || fallbackName;
  link.click();
}

export function formatDocumentList(documents = []) {
  if (!documents.length) return '—';
  return documents.map((doc) => doc.fileName).join(', ');
}
