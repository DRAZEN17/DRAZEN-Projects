import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const NotFound = () => {
  return (
    <div className="col-center min-h-[80vh] gap-5 text-center px-6">
      <p className="eyebrow">404</p>
      <p className="font-display italic text-4xl text-ink">This page wandered off.</p>
      <p className="font-sans text-sm text-taupe max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist, or the link may be out of date.
      </p>
      <div className="flex items-center gap-3 mt-2">
        <Link to="/" className="btn-solid w-fit">
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Back Home
        </Link>
        <Link to="/shop" className="btn-outline w-fit">
          Browse the Shop
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
