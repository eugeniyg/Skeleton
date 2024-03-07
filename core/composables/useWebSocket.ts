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
