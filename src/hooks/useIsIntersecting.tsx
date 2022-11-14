"use client";

import { type MutableRefObject, useEffect, useState, type RefObject } from "react";

export function useIsIntersecting(ref: MutableRefObject<Element | null>, rootMargin = "0px"): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const node = ref?.current; // DOM Ref
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(!!entry?.isIntersecting);
      },
      { rootMargin },
    );
    if (node) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isIntersecting;
}
