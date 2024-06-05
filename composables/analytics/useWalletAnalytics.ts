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
      funnelStep: 'selectBonus',
      operationType: 'deposit'
    })
  }

  const sendWalletDeclineBonusesEvent = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'declineBonuses',
      operationType: 'deposit'
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
      funnelStep: 'promoOpen',
      operationType: 'deposit'
    })
  }

  const sendWalletPromoSubmitEvent = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'promoSent',
      operationType: 'deposit'
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