import type { IObserverOptions } from '@skeleton/api/types';

export const initObserver = (options: IObserverOptions): any => {
  const optionsThing = {
    once: options?.once || false,
    settings: options?.settings || { root: null, rootMargin: '0px', threshold: 0.05 },
  };

  const inviewEvent = new Event('inview', { bubbles: false, cancelable: true });
  const outviewEvent = new Event('outview', { bubbles: false, cancelable: true });

  const callback = (entries: any, observer: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        entry.target.dispatchEvent(inviewEvent);
        if (optionsThing.once) observer.unobserve(entry.target);
      } else {
        entry.target.dispatchEvent(outviewEvent);
      }
    });
  };

  return new IntersectionObserver(callback, optionsThing.settings);
};
