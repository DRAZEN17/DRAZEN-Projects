const fieldClasses =
  "w-full border-b border-line bg-transparent py-2.5 font-sans text-sm outline-none focus:border-ink transition-colors";

const FormField = ({ label, type = "text", textarea = false, className = "", ...props }) => {
  return (
    <div className={className}>
      <label className="font-sans text-xs uppercase tracking-wide text-taupe">{label}</label>
      {textarea ? (
        <textarea className={`${fieldClasses} resize-none`} rows={4} {...props} />
      ) : (
        <input type={type} className={fieldClasses} {...props} />
      )}
    </div>
  );
};

export default FormField;
