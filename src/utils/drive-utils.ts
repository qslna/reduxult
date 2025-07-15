// Google Drive video IDs for Fashion Film section
export const FASHION_FILM_IDS = {
  'designer-parkparang': '15d901XRElkF5p7xiJYelIyblYFb-PtsD',
  'designer-leetaehyeon': '1fG2fchKvEG7i7Lo79K7250mgiVTse6ks', 
  'designer-kimgyeongsu': '1Hl594dd_MY714hZwmklTAPTc-pofe9bY',
  'designer-kimbomin': '1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X',
  'designer-hwangjinsu': '1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d',
  'designer-choieunsol': '1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3'
};

// Generate Google Drive embed URL
export function getGoogleDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Generate Google Drive download URL
export function getGoogleDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Generate Google Drive thumbnail URL
export function getGoogleDriveThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
}