import { Centrifuge } from 'centrifuge';

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
      const profileStore = useProfileStore();
      if (profileStore?.isLoggedIn) {
        this.webSocket = new Centrifuge(`${protocol}//${socketUrl}/api/connection/websocket`, {
          getToken: this.getCentrifugeToken,
        });
      } else {
        this.webSocket = new Centrifuge(`${protocol}//${socketUrl}/api/connection/websocket`);
      }
      await this.webSocket.connect();
    },

    async reconnectSocket(): Promise<void> {
      await this.webSocket.disconnect();
      await this.initWebSocket();
      await nextTick();
      useEvent('webSocketReconnected');
    },

    createSubscription<T>(channel: string, callback?: (data: T) => void) {
      const subscription = this.webSocket.getSubscription(channel) || this.webSocket.newSubscription(channel);
      if (callback) subscription.on('publication', callback);
      subscription.subscribe();

      return subscription;
    },
  },
});
