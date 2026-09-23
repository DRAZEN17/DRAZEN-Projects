import { Link } from "react-router-dom";
import Icon from "./Icon";


const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <Icon name="chevronRight" className="size-3 text-taupe/70 flex-none" />}
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
