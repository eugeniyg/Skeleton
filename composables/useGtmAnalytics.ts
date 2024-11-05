import type { IAnalyticsEvent } from "@skeleton/types";

export const useGtmAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  //-- METHOD NAMES MUST BE THE SAME AS EVENT NAMES --//
  //-- skeleton/types/index.ts --//


  //--!!! REGISTRATION EVENTS !!!--//

  const baseRegFunnelObj = {
    event: 'Action',
    eventCategory: 'registrationFunnel',
  }

  const registrationOpen = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'open',
      loadTime: eventData.loadTime || 0
    })
  }

  const registrationChangeType = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: eventData.regType || 'not set'
    })
  }

  const registrationSuccess = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'registration',
      userId: profileStore.profile?.id,
      regType: eventData.regType || 'not set',
    })
  }

  const registrationSubmit = (): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'sent'
    })
  }

  const registrationOtp = (): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'otp'
    })
  }


  //--!!! WALLET EVENTS !!!--//

  const baseWalletFunnelObj = {
    event: 'Action',
    eventCategory: 'walletFunnel'
  }

  const walletOpen = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'open',
      userId: profileStore.profile?.id,
      loadTime: eventData.loadTime || 0
    })
  }

  const walletChangeNetwork = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      funnelStep: 'network',
      userId: profileStore.profile?.id,
      operationType: eventData.walletOperationType || 'not set'
    })
  }

  const walletChangeType = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: eventData.walletOperationType || 'not set'
    })
  }

  const walletSelectBonus = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'selectBonus',
      operationType: 'deposit'
    })
  }

  const walletDeclineBonuses = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'declineBonuses',
      operationType: 'deposit'
    })
  }

  const walletChangeMethod = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'method',
      operationType: eventData.walletOperationType || 'not set'
    })
  }

  const walletSubmitForm = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'sent',
      operationType: eventData.walletOperationType || 'not set'
    })
  }

  const walletDepositSuccess = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      event: 'purchase',
      eventCategory: 'deposit',
      userId: profileStore.profile?.id,
      depositAmount: eventData.depositAmount || 0,
      depositCurrency: eventData.depositCurrency || 'not set',
      successDepositNumber: eventData.successDepositNumber || 0,
      invoiceId: eventData.invoiceId || 'not set',
      walletType: eventData.walletType || 'not set',
      ecommerce: {
        transaction_id: eventData.invoiceId || 'not set',
        value: eventData.depositAmount || 0,
        currency: eventData.depositCurrency || 'not set',
        items: [
          {
            item_id: eventData.invoiceId || 'not set',
            item_name: 'deposit',
            affiliation: eventData.walletType || 'not set',
            item_brand: '',
            item_category: 'Financial Services',
            item_category2: 'Deposits',
            price: eventData.depositAmount || 0,
            quantity: 1
          }
        ]
      }
    })
  }

  const walletWithdrawSuccess = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'withdraw',
      userId: profileStore.profile?.id,
      withdrawAmount: eventData.withdrawAmount || 0,
      withdrawCurrency: eventData.withdrawCurrency || 'not set',
      invoiceId: eventData.invoiceId || 'not set',
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletDepositFail = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'failDeposit',
      userId: profileStore.profile?.id,
      depositAmount: eventData.depositAmount || 0,
      depositCurrency: eventData.depositCurrency || 'not set',
      invoiceId: eventData.invoiceId || 'not set',
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletWithdrawFail = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      event: 'Action',
      eventCategory: 'failWithdraw',
      userId: profileStore.profile?.id,
      withdrawAmount: eventData.withdrawAmount || 0,
      withdrawCurrency: eventData.withdrawCurrency || 'not set',
      invoiceId: eventData.invoiceId || 'not set',
      walletType: eventData.walletType || 'not set'
    })
  }

  const walletClose = (eventData: IAnalyticsEvent): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'close',
      operationType: eventData.walletOperationType || 'not set'
    })
  }

  const walletPromoOpen = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'promoOpen',
      operationType: 'deposit'
    })
  }

  const walletPromoSubmit = (): void => {
    gtm?.trackEvent({
      ...baseWalletFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'promoSent',
      operationType: 'deposit'
    })
  }


  //--!!! BALANCE EVENTS !!!--//

  const baseBalanceFunnelObj = {
    event: 'Action',
    eventCategory: 'balanceFunnel'
  }

  const openBalancePopup = (): void => {
    gtm?.trackEvent({
      ...baseBalanceFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'open'
    })
  }

  return {
    registrationOpen,
    registrationChangeType,
    registrationSuccess,
    registrationSubmit,
    registrationOtp,
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
    walletPromoSubmit,
    openBalancePopup
  }
}