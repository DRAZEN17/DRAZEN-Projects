import { FileText, X, Upload } from 'lucide-react';

export function FileUpload({ label, files = [], onChange, accept = '.pdf,.jpg,.jpeg,.png' }) {
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).map((f) => ({ name: f.name, size: f.size }));
    onChange?.([...files, ...selected]);
    e.target.value = '';
  };

  const remove = (i) => onChange?.(files.filter((_, idx) => idx !== i));

  return (
    <div>
      {label && <label className="text-sm font-medium text-ink-muted">{label}</label>}
      <div className="mt-2 flex flex-col gap-2">
        {files.map((f, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
            <span className="flex items-center gap-2 text-ink-muted">
              <FileText size={14} /> {f.name}
            </span>
            <button type="button" onClick={() => remove(i)} aria-label="Remove file">
              <X size={14} className="text-ink-muted hover:text-ink" />
            </button>
          </div>
        ))}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-ink-muted hover:text-ink">
          <Upload size={14} />
          Upload file
          <input type="file" accept={accept} multiple className="hidden" onChange={handleFiles} />
        </label>
      </div>
    </div>
  );
}
