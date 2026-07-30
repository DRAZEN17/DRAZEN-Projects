/**
 * The site's signature motion element — a small pill-shaped label that
 * "unfurls" open via clip-path when scrolled into view. Direct port of the
 * source template's ClipPathTitle technique, restyled as DRAZIME'S section
 * eyebrows. The actual animation lives in useScrollReveal (shared across
 * pages) so this component stays purely presentational.
 */
const RevealTag = ({ children, className = "" }) => {
  return (
    <span className={`reveal-tag ${className}`}>
      <span className="reveal-tag-inner">{children}</span>
    </span>
  );
};

export default RevealTag;
