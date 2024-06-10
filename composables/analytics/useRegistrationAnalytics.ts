import type { IRegistrationEvent } from "@skeleton/types/analytics";

export const useRegistrationAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  //-- METHOD NAMES MUST BE THE SAME AS EVENT NAMES --//
  //-- skeleton/types/analytics.ts --//

  const baseRegFunnelObj = {
    event: 'Action',
    eventCategory: 'registrationFunnel',
  }

  const registrationOpen = (eventData: IRegistrationEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'open',
      loadTime: eventData.loadTime || 0
    })
  }

  const registrationChangeType = (eventData: IRegistrationEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: eventData.regType || 'not set'
    })
  }

  const registrationSuccess = (eventData: IRegistrationEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: profileStore.profile?.id,
      regType: eventData.regType || 'not set',
    })
  }

  const registrationSubmit = (eventData: IRegistrationEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'sent'
    })
  }

  const registrationOtp = (eventData: IRegistrationEvent): void => {
    gtm?.trackEvent({
      ...baseRegFunnelObj,
      userId: 'not set',
      funnelStep: 'otp'
    })
  }

  return {
    registrationOpen,
    registrationChangeType,
    registrationSuccess,
    registrationSubmit,
    registrationOtp
  }
}