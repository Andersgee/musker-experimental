import { useCallback } from "react";

/**
 * Wrapper for ```new IntersectionObserver(callback, options)```
 *
 * [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 *
 * note to self:
 * This is the simplest I could make it... options are static (can not be changed after init)
 *
 * ### Example
 *
 * ```ts
 * const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
 *   if (!!entry?.isIntersecting) {
 *     fetchNextPage();
 *   }
 * });
 * ```
 */
export function UseIntersectionObserverCallback<T extends Element>(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  //see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const ref = useCallback((node: T) => {
    if (node !== null) {
      const observer = new IntersectionObserver(callback, options);
      observer.observe(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
