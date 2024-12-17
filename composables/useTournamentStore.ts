import { defineStore } from 'pinia';
import type { IWebSocketResponse } from '@skeleton/core/types';

interface ITournamentStoreState {
  tournamentSubscription: any;
}

export const useTournamentsStore = defineStore('tournamentsStore', {
  state: (): ITournamentStoreState => ({
    tournamentSubscription: undefined,
  }),

  actions: {
    handleTournamentsEvent(webSocketResponse: IWebSocketResponse): void {
      const tournamentData = webSocketResponse.data.tournament;
      if (webSocketResponse.data.event === 'tournament.completed' && tournamentData) {
        const profileStore = useProfileStore();
        const findUserPrize = tournamentData.prizes.find(prize => {
          return prize.entry?.playerId === profileStore.profile?.id;
        });

        const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
        const alertRawContent = alertsData?.tournament.completed || defaultLocaleAlertsData?.tournament.completed;
        if (findUserPrize && alertRawContent) {
          const { showAlert } = useLayoutStore();
          let alertDescription = alertRawContent.description?.replace('{place}', `${findUserPrize.place}`);
          alertDescription = alertDescription?.replace('{tournament}', tournamentData.title);
          alertDescription = alertDescription?.replace('{prize}', findUserPrize.title);
          showAlert({ ...alertRawContent, description: alertDescription });
        }
      }
    },

    subscribeTournamentSocket(): void {
      const { createSubscription } = useWebSocket();
      this.tournamentSubscription = createSubscription('tournaments', this.handleTournamentsEvent);
    },

    unsubscribeTournamentSocket(): void {
      if (this.tournamentSubscription) {
        this.tournamentSubscription.unsubscribe();
        this.tournamentSubscription.removeAllListeners();
      }
    },
  },
});
