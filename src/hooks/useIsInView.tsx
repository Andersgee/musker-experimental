import { type RefObject, useEffect, useState } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

export function useIsInView(elementRef: RefObject<Element>) {
  const [inView, setInView] = useState(false);
  const entry = useIntersectionObserver(elementRef, { freezeOnceVisible: false });
  useEffect(() => {
    if (entry?.isIntersecting === true && inView === false) {
      setInView(true);
    } else if (entry?.isIntersecting === false && inView === true) {
      setInView(false);
    }
  }, [entry, inView]);
  return inView;
}
