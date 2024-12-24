import { defineStore } from 'pinia';
import type { IMessage, IWebSocketResponse } from '@skeleton/core/types';

interface INotificationStoreState {
  unreadCount: number;
  popoverNotifications: IMessage[];
  notificationSubscription: any;
}

export const useNotificationStore = defineStore('notificationStore', {
  state: (): INotificationStoreState => ({
    unreadCount: 0,
    popoverNotifications: [],
    notificationSubscription: undefined,
  }),

  actions: {
    async getPopoverNotifications(): Promise<void> {
      const { getPlayerNotifications } = useCoreNotificationApi();
      const { data, meta } = await getPlayerNotifications({ page: 1, perPage: 3 });
      this.popoverNotifications = data;
      this.unreadCount = meta.totalUnread;
    },

    async readMessages(messageIds: string[]): Promise<void> {
      const { markMessagesAsRead } = useCoreNotificationApi();
      const response = await markMessagesAsRead(messageIds);
      this.unreadCount = response.totalUnread;
      this.popoverNotifications = this.popoverNotifications.map(message => {
        if (messageIds.includes(message.id)) return { ...message, readAt: new Date().toISOString(), state: 2 };
        return message;
      });
    },

    async readAllMessages(): Promise<void> {
      const { markAllMessagesAsRead } = useCoreNotificationApi();
      const response = await markAllMessagesAsRead();
      this.unreadCount = response.totalUnread;
      this.popoverNotifications = this.popoverNotifications.map(message => ({
        ...message,
        readAt: new Date().toISOString(),
        state: 2,
      }));
    },

    showNotificationAlert(title: string | undefined): void {
      if (!title) return;
      const { alertsData, defaultLocaleLayoutData } = useGlobalStore();
      const { getContent } = useProjectMethods();
      const { showAlert } = useLayoutStore();
      const alertContent = getContent(alertsData, defaultLocaleLayoutData, 'global.newNotification');
      if (alertContent.description) {
        showAlert({
          ...alertContent,
          description: alertContent.description.replace('{title}', title),
        });
      }
    },

    newNotificationTrigger(webSocketResponse: IWebSocketResponse): void {
      const notificationTitle = webSocketResponse.data?.message?.content?.title;
      this.showNotificationAlert(notificationTitle);
      this.unreadCount += 1;
      this.popoverNotifications = [webSocketResponse.data?.message as IMessage, ...this.popoverNotifications].slice(
        0,
        3
      );
      useEvent('newPlayerMessage');
    },

    subscribeNotificationSocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.notificationSubscription = createSubscription(
          `messenger:notifications#${profileStore.profile?.id}`,
          this.newNotificationTrigger
        );
      }
    },

    unsubscribeNotificationSocket(): void {
      if (this.notificationSubscription) {
        this.notificationSubscription.unsubscribe();
        this.notificationSubscription.removeAllListeners();
      }
    },
  },
});
