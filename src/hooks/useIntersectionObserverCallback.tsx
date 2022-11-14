import { useCallback } from "react";

export function UseIntersectionObserverCallback<T extends Element>(cb: () => void) {
  const ref = useCallback((node: T) => {
    //see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    if (node !== null) {
      const rootMargin = "0px";
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = !!entry?.isIntersecting;
          if (isVisible) {
            cb();
          }
        },
        { rootMargin },
      );
      observer.observe(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
