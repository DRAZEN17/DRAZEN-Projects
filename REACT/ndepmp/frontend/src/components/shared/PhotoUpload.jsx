import { useState } from 'react';
import { Camera, X } from 'lucide-react';

export function PhotoUpload({ label = 'Photos', onChange, max = 6 }) {
  const [previews, setPreviews] = useState([]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []).slice(0, max - previews.length);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, dataUrl: reader.result });
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((newOnes) => {
      const updated = [...previews, ...newOnes];
      setPreviews(updated);
      onChange?.(updated);
    });
    e.target.value = '';
  };

  const remove = (i) => {
    const updated = previews.filter((_, idx) => idx !== i);
    setPreviews(updated);
    onChange?.(updated);
  };

  return (
    <div>
      {label && <label className="text-sm font-medium text-ink-muted">{label}</label>}
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {previews.map((p, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border">
            <img src={p.dataUrl} alt={p.name} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Remove photo"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        {previews.length < max && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-ink-muted hover:text-ink">
            <Camera size={18} />
            <span className="text-[10px]">Add photo</span>
            <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handleFiles} />
          </label>
        )}
      </div>
    </div>
  );
}
