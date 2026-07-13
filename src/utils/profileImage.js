export const MAX_PROFILE_IMAGE_BYTES = 3 * 1024 * 1024;
export const ACCEPTED_PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function readProfileImageFile(file) {
  if (!file) {
    throw new Error('missing');
  }

  if (!ACCEPTED_PROFILE_IMAGE_TYPES.includes(file.type)) {
    throw new Error('invalidType');
  }

  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
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

export function downloadProfileImage(profileImage, fallbackName = 'blue-passport-photo') {
  if (!profileImage?.dataUrl) return;

  const extension = profileImage.mimeType?.split('/')[1] || 'jpg';
  const link = document.createElement('a');
  link.href = profileImage.dataUrl;
  link.download = profileImage.fileName || `${fallbackName}.${extension}`;
  link.click();
}

export async function shareProfileImage(profileImage, title, text) {
  if (!profileImage?.dataUrl || !navigator.canShare) return false;

  const response = await fetch(profileImage.dataUrl);
  const blob = await response.blob();
  const file = new File([blob], profileImage.fileName || 'profile-photo.jpg', {
    type: profileImage.mimeType || 'image/jpeg',
  });

  if (!navigator.canShare({ files: [file] })) return false;

  await navigator.share({ title, text, files: [file] });
  return true;
}
