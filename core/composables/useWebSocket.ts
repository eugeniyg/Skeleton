import { defineStore } from 'pinia';
import { Centrifuge } from 'centrifuge';

export type ISocketState = {
  webSocket: any,
}

export const useWebSocket = defineStore('useWebSocket', {
  state: (): ISocketState => ({
    webSocket: undefined
  }),

  actions: {
    async initWebSocket ():Promise<void> {
      const socketUrl = process.dev ? 'test.dev.getplatform.tech' : window.location.hostname;
      const protocol = window.location.protocol.replace('http', 'ws');
      const { getSessionToken } = useProfileStore();
      const sessionToken = getSessionToken();
      this.webSocket = new Centrifuge(`${protocol}//${socketUrl}/api/connection/websocket`, {
        token: sessionToken || ''
      });
      await this.webSocket.connect();
    },

    async reconnectSocket ():Promise<void> {
      await this.webSocket.disconnect();
      await this.initWebSocket();
    },

    createSubscription (channel:string, callback:Function) {
      const subscription = this.webSocket.newSubscription(channel);
      subscription.on('publication', callback);
      subscription.subscribe();

      return subscription;
    }
  }
})
