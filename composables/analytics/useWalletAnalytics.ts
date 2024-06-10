import type {IWalletEvent} from "@skeleton/types/analytics";

export const useWalletAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  //-- METHOD NAMES MUST BE THE SAME AS EVENT NAMES --//
  //-- skeleton/types/analytics.ts --//

  const baseWalletFunnelObj = {
    event: 'Action',
    eventCategory: 'walletFunnel'
  }

  const walletOpen = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'open',
      userId: profileStore.profile?.id,
      loadTime: eventData.loadTime || 0
    })
  }

  const walletChangeNetwork = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'network',
      userId: profileStore.profile?.id,
      operationType: eventData.operationType || 'not set'
    })
  }

  const walletChangeType = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: eventData.operationType || 'not set'
    })
  }

  const walletSelectBonus = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'selectBonus',
      operationType: 'deposit'
    })
  }

  const walletDeclineBonuses = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'declineBonuses',
      operationType: 'deposit'
    })
  }

  const walletChangeMethod = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'method',
      operationType: eventData.operationType || 'not set'
    })
  }

  const walletSubmitForm = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'sent',
      operationType: eventData.operationType || 'not set'
    })
  }

  const walletDepositSuccess = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'deposit',
      userId: profileStore.profile?.id,
      depositAmount: eventData.depositAmount || 0,
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletWithdrawSuccess = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'withdraw',
      userId: profileStore.profile?.id,
      withdrawAmount: eventData.withdrawAmount || 0,
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletDepositFail = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'failDeposit',
      userId: profileStore.profile?.id,
      depositAmount: eventData.depositAmount || 0,
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletWithdrawFail = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'failWithdraw',
      userId: profileStore.profile?.id,
      withdrawAmount: eventData.withdrawAmount || 0,
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletClose = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'close',
      operationType: eventData.operationType || 'not set'
    })
  }

  const walletPromoOpen = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'promoOpen',
      operationType: 'deposit'
    })
  }

  const walletPromoSubmit = (eventData: IWalletEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'promoSent',
      operationType: 'deposit'
    })
  }

  return {
    walletOpen,
    walletChangeNetwork,
    walletChangeType,
    walletSelectBonus,
    walletDeclineBonuses,
    walletChangeMethod,
    walletSubmitForm,
    walletDepositSuccess,
    walletWithdrawSuccess,
    walletDepositFail,
    walletWithdrawFail,
    walletClose,
    walletPromoOpen,
    walletPromoSubmit
  }
}