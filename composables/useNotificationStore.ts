import { defineStore } from 'pinia';
import type {IMessage} from "@skeleton/core/types";
import {useCoreNotificationApi} from "@skeleton/core/composables/useNotificationApi";

interface INotificationStoreState {
  unreadCount: number;
  popoverNotifications: IMessage[];
}

export const useNotificationStore = defineStore('notificationStore', {
  state: ():INotificationStoreState => ({
    unreadCount: 0,
    popoverNotifications: []
  }),

  actions: {
    async getPopoverNotifications():Promise<void> {
      const { getPlayerNotifications } = useCoreNotificationApi();
      const {
        data,
        meta
      } = await getPlayerNotifications({ page: 1, perPage: 3 });
      this.popoverNotifications = data;
      this.unreadCount = meta.totalUnread;
    },
  }
});
