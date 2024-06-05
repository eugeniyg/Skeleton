export const useBalanceAnalytics = () => {
  const gtm = useGtm();
  const profileStore = useProfileStore();

  const baseBalanceFunnelObj = {
    event: 'Action',
    eventCategory: 'balanceFunnel',
    userId: profileStore.profile?.id
  }

  const sendBalanceOpenEvent = (): void => {
    gtm?.trackEvent({
      ...baseBalanceFunnelObj,
      funnelStep: 'open'
    })
  }


  return {
    sendBalanceOpenEvent
  }
}