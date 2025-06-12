import { defineStore } from 'pinia';
import type { IWebSocketResponse } from '@skeleton/core/types';

interface IWheelsStoreState {
  wheelsSubscription: any;
}

export const useWheelsStore = defineStore('wheelsStore', {
  state: (): IWheelsStoreState => ({
    wheelsSubscription: undefined,
  }),

  actions: {
    handleWheelsEvent(webSocketResponse: IWebSocketResponse): void {
      const wheelData = webSocketResponse.data.wheel;
      const spinsCount = webSocketResponse.data.amount;
      if (webSocketResponse.data.event === 'wheel.spin.issued' && wheelData && spinsCount) {
        const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
        const alertRawContent = alertsData?.wheel.spinsIssued || defaultLocaleAlertsData?.wheel.spinsIssued;
        if (alertRawContent) {
          const { showAlert } = useLayoutStore();
          let alertDescription = alertRawContent.description?.replace('{count}', `<b>${spinsCount}</b>`);
          alertDescription = alertDescription?.replace(
            '{wheel}',
            `<a href="/wheels/${wheelData.identity}">${wheelData.title}</a>`
          );
          showAlert({ ...alertRawContent, description: alertDescription });
        }

        useEvent('wheelSpinsIssued', wheelData.identity);
      }
    },

    subscribeWheelsSocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.wheelsSubscription = createSubscription(
          `retention:wheels#${profileStore.profile.id}`,
          this.handleWheelsEvent
        );
      }
    },

    unsubscribeWheelsSocket(): void {
      if (this.wheelsSubscription) {
        this.wheelsSubscription.unsubscribe();
        this.wheelsSubscription.removeAllListeners();
      }
    },
  },
});
