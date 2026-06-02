// Upload service: tries Cloudinary unsigned upload if configured, otherwise falls back to in-browser mock via `api`.
import { api } from './api.js';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export async function uploadImage(file, onProgress) {
  if (CLOUDINARY_URL && CLOUDINARY_UPLOAD_PRESET) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // Cloudinary doesn't support progress via fetch; use xhr for progress support
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', CLOUDINARY_URL);
      xhr.upload.onprogress = (ev) => { if (ev.lengthComputable && typeof onProgress === 'function') onProgress({ loaded: ev.loaded, total: ev.total }); };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { const resp = JSON.parse(xhr.responseText); resolve({ url: resp.secure_url || resp.url, publicId: resp.public_id || resp.original_filename }); }
          catch (e) { reject(e); }
        } else { reject(new Error('Upload failed')); }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(fd);
    });
  }

  // Fallback: use app api (mockBackend) which accepts FormData at /upload/image
  if (onProgress) {
    return api.post('/upload/image', (function () { const fd = new FormData(); fd.append('image', file); return fd; })(), { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: onProgress }).then((r) => r.data);
  }
  return api.post('/upload/image', (function () { const fd = new FormData(); fd.append('image', file); return fd; })(), { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
}

export default { uploadImage };
