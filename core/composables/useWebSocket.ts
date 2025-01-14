import { defineStore } from 'pinia';
import { Centrifuge } from 'centrifuge';
import type { IWebSocketResponse } from '@skeleton/core/types';

export type ISocketState = {
  webSocket: any;
};

export const useWebSocket = defineStore('useWebSocket', {
  state: (): ISocketState => ({
    webSocket: undefined,
  }),

  actions: {
    async getCentrifugeToken(): Promise<string> {
      const { getSessionToken, isTokenExpired, refreshToken } = useProfileStore();
      let currentSessionToken = getSessionToken();
      if (!currentSessionToken) return '';
      if (isTokenExpired()) currentSessionToken = await refreshToken();
      return currentSessionToken;
    },

    async initWebSocket(): Promise<void> {
      const socketUrl = import.meta.dev ? 'qa2.dev.getplatform.tech' : window.location.hostname;
      const protocol = window.location.protocol.replace('http', 'ws');
      this.webSocket = new Centrifuge(`${protocol}//${socketUrl}/api/connection/websocket`, {
        getToken: this.getCentrifugeToken,
      });
      await this.webSocket.connect();
    },

    async reconnectSocket(): Promise<void> {
      await this.webSocket.disconnect();
      await this.initWebSocket();
    },

    createSubscription(channel: string, callback?: (data: IWebSocketResponse) => void) {
      const subscription = this.webSocket.getSubscription(channel) || this.webSocket.newSubscription(channel);
      if (callback) subscription.on('publication', callback);
      subscription.subscribe();

      return subscription;
    },
  },
});
