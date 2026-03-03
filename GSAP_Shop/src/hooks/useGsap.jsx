import { useEffect, useState } from "react";

export default function useGsap() {
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    if (window.gsap) {
      setGsapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => setGsapLoaded(true);
    document.body.appendChild(script);
  }, []);

  return gsapLoaded;
}
