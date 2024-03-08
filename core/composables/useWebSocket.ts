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
    async getFreshToken() {
      console.log('getFreshToken');
      const profileStore = useProfileStore();
      if (!profileStore.isLoggedIn) {
        throw new UnauthorizedError('Unauthorized!');
      }

      try {
        const token = profileStore.getSessionToken();
        return await profileStore.refreshToken({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch {
        throw new UnauthorizedError('Unauthorized!');
      }
    },

    updateSocketToken (): void {
      const { getSessionToken } = useProfileStore();
      const sessionToken = getSessionToken();
      this.webSocket.setToken(sessionToken || '');
    },

    initWebSocket ():void {
      console.log('init websocket');
      const socketUrl = process.dev ? 'test.dev.getplatform.tech' : window.location.hostname;
      const protocol = window.location.protocol.replace('http', 'ws');
      this.webSocket = new Centrifuge(`${protocol}//${socketUrl}/api/connection/websocket`, {
        getToken: this.getFreshToken
      });
    },

    connectSocket ():void {
      console.log('connect websocket');
      this.updateSocketToken();
      this.webSocket.connect();
    },

    disconnectSocket ():void {
      console.log('disconnect socket');
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
