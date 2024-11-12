import type { IAnalyticsEvent } from '@skeleton/types';

export default defineNuxtPlugin(nuxtApp => {
  const gtm = useGtm();
  if (!gtm?.options?.enabled) return;

  const gtmAnalytics = useGtmAnalytics();

  const sendAnalyticsEvent = (eventData: IAnalyticsEvent): void => {
    if (typeof gtmAnalytics[eventData.event] === 'function') {
      gtmAnalytics[eventData.event](eventData);
    }
  };

  nuxtApp.hook('app:mounted', () => {
    useListen('analyticsEvent', sendAnalyticsEvent);
  });
});
