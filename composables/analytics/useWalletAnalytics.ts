export const useWalletAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  const baseWalletFunnelObj = {
    event: 'Action',
    eventCategory: 'walletFunnel',
    userId: profileStore.profile?.id
  }

  const sendWalletOpenEvent = (loadTime: number): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'open',
      loadTime
    })
  }

  const sendWalletNetworkEvent = (operationType: 'deposit'| 'withdraw'): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'network',
      operationType
    })
  }

  const sendWalletChangeTypeEvent = (operationType: 'deposit'| 'withdraw'): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: operationType
    })
  }

  const sendWalletSelectBonusEvent = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'selectBonus'
    })
  }

  const sendWalletDeclineBonusesEvent = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'declineBonuses'
    })
  }

  const sendWalletMethodEvent = (operationType: 'deposit'| 'withdraw'): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'method',
      operationType
    })
  }

  const sendWalletSubmitEvent = (operationType: 'deposit'| 'withdraw'): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'sent',
      operationType
    })
  }

  const sendWalletDepSuccessEvent = (depositAmount: number, walletType: string): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'deposit',
      userId: profileStore.profile?.id,
      depositAmount,
      walletType
    })
  }

  const sendWalletWithdrawSuccessEvent = (withdrawAmount: number, walletType: string): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'withdraw',
      userId: profileStore.profile?.id,
      withdrawAmount,
      walletType
    })
  }

  const sendWalletCloseEvent = (operationType: 'deposit'| 'withdraw'): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'close',
      operationType
    })
  }

  const sendWalletPromoOpenEvent = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'promoOpen'
    })
  }

  const sendWalletPromoSubmitEvent = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'promoSent'
    })
  }

  return {
    sendWalletOpenEvent,
    sendWalletNetworkEvent,
    sendWalletChangeTypeEvent,
    sendWalletSelectBonusEvent,
    sendWalletDeclineBonusesEvent,
    sendWalletMethodEvent,
    sendWalletSubmitEvent,
    sendWalletDepSuccessEvent,
    sendWalletWithdrawSuccessEvent,
    sendWalletCloseEvent,
    sendWalletPromoOpenEvent,
    sendWalletPromoSubmitEvent
  }
}