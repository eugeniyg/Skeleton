import type { RegistrationType } from "@skeleton/core/types";

export const useRegistrationAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  const baseRegFunnelObj = {
    event: 'Action',
    eventCategory: 'registrationFunnel',
  }

  const sendRegOpenEvent = (loadTime: number): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'open',
      loadTime
    })
  }

  const sendChangeRegTypeEvent = (regType: RegistrationType): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: regType
    })
  }

  const sendRegSuccessEvent = (regType: RegistrationType): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: profileStore.profile?.id,
      regType
    })
  }

  const sendRegSubmitEvent = (): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'sent'
    })
  }

  const sendRegOtpEvent = (): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'otp'
    })
  }

  return {
    sendRegOpenEvent,
    sendChangeRegTypeEvent,
    sendRegSuccessEvent,
    sendRegSubmitEvent,
    sendRegOtpEvent
  }
}