// Shared limits for file uploads.
//
// The backend is hosted on Vercel serverless functions, which reject any
// request body larger than 4.5MB with an HTTP 413 (Payload Too Large).
// That 413 response does not include CORS headers, so the browser blocks it
// and Angular's HttpClient reports `status: 0` even though the Network tab
// shows 413. Validating the size on the client avoids that confusing case.
export const MAX_UPLOAD_SIZE_MB = 4.5;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
export const MAX_UPLOAD_SIZE_LABEL = `${MAX_UPLOAD_SIZE_MB}MB`;

// True when any of the provided files exceeds the maximum upload size.
export function isFileTooLarge(files: File | File[] | null | undefined): boolean {
  if (!files) {
    return false;
  }
  const list = Array.isArray(files) ? files : [files];
  return list.some(file => !!file && file.size > MAX_UPLOAD_SIZE_BYTES);
}
