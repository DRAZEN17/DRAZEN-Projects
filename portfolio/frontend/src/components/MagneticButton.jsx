import { useMagnetic } from '../hooks/useMagnetic.js';

export default function MagneticButton({ as: Tag = 'button', children, className = '', ...props }) {
  const ref = useMagnetic(0.35);
  return (
    <Tag ref={ref} data-magnetic className={`btn-magnetic ${className}`} {...props}>
      {children}
    </Tag>
  );
}
