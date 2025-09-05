import type { ILotteryIssuedEvent, ILotteryWonEvent } from '@skeleton/api/types';

interface ILotteryState {
  selectedLotteryId: string | undefined;
  isLotteryUpdating: boolean;
  lotterySubscription: any;
}

export const useLotteryStore = defineStore('lotteryStore', {
  state: (): ILotteryState => ({
    selectedLotteryId: undefined,
    isLotteryUpdating: false,
    lotterySubscription: undefined,
  }),

  actions: {
    handleLotteryEvent(webSocketResponse: Maybe<ILotteryIssuedEvent | ILotteryWonEvent>): void {
      const eventData = webSocketResponse?.data;
      if (!eventData) return;

      if (eventData.event === 'lottery.tickets.issued') {
        const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
        const alertRawContent = alertsData?.lottery?.issued || defaultLocaleAlertsData?.lottery?.issued;
        if (alertRawContent) {
          const { showAlert } = useLayoutStore();
          let alertDescription = alertRawContent.description
            ?.replace('{ticketsCount}', eventData.ticketsCount?.toString())
            ?.replace('{lotteryTitle}', eventData.lottery.title)
          showAlert({ ...alertRawContent, description: alertDescription });
        }
      }

      if (eventData.event === 'lottery.ticket.won') {
        const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
        const alertRawContent = alertsData?.lottery?.won || defaultLocaleAlertsData?.lottery?.won;
        if (alertRawContent) {
          const { showAlert } = useLayoutStore();
          let alertDescription = alertRawContent.description
            ?.replace('{prizeTitle}', eventData.prize.title)
            ?.replace('{lotteryTitle}', eventData.lottery.title)
          showAlert({ ...alertRawContent, description: alertDescription });
        }
      }
    },

    subscribeLotterySocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocketStore();
        this.lotterySubscription = createSubscription(
          `retention:lotteries#${profileStore.profile.id}`,
          this.handleLotteryEvent
        );
      }
    },

    unsubscribeLotterySocket(): void {
      if (this.lotterySubscription) {
        this.lotterySubscription.unsubscribe();
        this.lotterySubscription.removeAllListeners();
      }
    },
  }
})