export function openBase64Pdf(dataUrl) {
  if (!dataUrl) return;

  try {
    const parts = dataUrl.split(',');
    const header = parts[0];
    const base64 = parts[1];
    const mimeMatch = header.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';

    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch (err) {
    console.error('Could not open PDF:', err);
    alert('Could not open the resume file.');
  }
}