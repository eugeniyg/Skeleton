import type { IBalanceEvent } from "@skeleton/types/analytics";

export const useBalanceAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  //-- METHOD NAMES MUST BE THE SAME AS EVENT NAMES --//
  //-- skeleton/types/analytics.ts --//

  const baseBalanceFunnelObj = {
    event: 'Action',
    eventCategory: 'balanceFunnel'
  }

  const openBalancePopup = (data: IBalanceEvent): void => {
    gtm?.trackEvent({
      ...baseBalanceFunnelObj,
      userId: profileStore.profile?.id,
      funnelStep: 'open'
    })
  }

  return {
    openBalancePopup
  }
}