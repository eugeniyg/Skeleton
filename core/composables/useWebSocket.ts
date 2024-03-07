import { defineStore } from 'pinia';
import { Centrifuge, UnauthorizedError } from 'centrifuge';

export type ISocketState = {
  webSocket: any,
}

export const useWebSocket = defineStore('useWebSocket', {
  state: (): ISocketState => ({
    webSocket: undefined
  }),

  actions: {
    async getToken() {
      const profileStore = useProfileStore();
      if (!profileStore.isLoggedIn) {
        throw new UnauthorizedError('Unauthorized!');
      }

      const res = await fetch('/centrifuge/connection_token');
      if (!res.ok) {
        if (res.status === 403) {
          // Return special error to not proceed with token refreshes, client will be disconnected.
          throw new UnauthorizedError();
        }
        // Any other error thrown will result into token refresh re-attempts.
        throw new Error(`Unexpected status code ${res.status}`);
      }
      const data = await res.json();
      return data.token;
    },

    initWebSocket ():void {
      const socketUrl = process.dev ? 'test.dev.getplatform.tech' : window.location.hostname;
      const protocol = window.location.protocol.replace('http', 'ws');
      this.webSocket = new Centrifuge(`${protocol}//${socketUrl}/api/connection/websocket`);
    },

    connectSocket ():void {
      const { getSessionToken } = useProfileStore();
      const sessionToken = getSessionToken();
      this.webSocket.setToken(sessionToken || '');
      this.webSocket.connect();
    },

    disconnectSocket ():void {
      if (this.webSocket) this.webSocket.disconnect();
    },

    createSubscription (channel:string, callback:Function) {
      const subscription = this.webSocket.newSubscription(channel);
      subscription.on('publication', callback);
      subscription.subscribe();

      return subscription;
    }
  }
})
