// @ts-nocheck
import type {
  IBalanceEvent, IRegistrationEvent, IWalletEvent
} from "@skeleton/types/analytics";

export default defineNuxtPlugin(nuxtApp => {
  const gtm = useGtm();
  if (!gtm?.options?.enabled) return;

  const balanceAnalytics = useBalanceAnalytics();
  const registrationAnalytics = useRegistrationAnalytics();
  const walletAnalytics = useWalletAnalytics();

  const sendRegistrationEvent = (eventData: IRegistrationEvent): void => {
    if (typeof registrationAnalytics[eventData.event] === 'function') {
      registrationAnalytics[eventData.event](eventData);
    }
  };

  const sendWalletEvent = (eventData: IWalletEvent): void => {
    if (typeof walletAnalytics[eventData.event] === 'function') {
      walletAnalytics[eventData.event](eventData);
    }
  };

  const sendBalanceEvent = (eventData: IBalanceEvent): void => {
    if (typeof balanceAnalytics[eventData.event] === 'function') {
      balanceAnalytics[eventData.event](eventData);
    }
  };

  nuxtApp.hook('app:mounted',  () => {
    useAnalyticsListen('registration', sendRegistrationEvent);
    useAnalyticsListen('wallet', sendWalletEvent);
    useAnalyticsListen('balance', sendBalanceEvent);
  });
})