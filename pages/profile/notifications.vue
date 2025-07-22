<template>
  <div class="profile-notifications content">
    <div class="profile-notifications__header">
      <div class="profile-notifications__title">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
      </div>

      <div class="profile-notifications__read-all" :class="{ active: unreadCount }" @click="readAll">
        <span>
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.markAsReadAll') }}
        </span>

        <atomic-icon id="read-all" />
      </div>
    </div>

    <div v-if="state.notifications.length" class="profile-notifications__content">
      <notification-accordion
        v-for="message in state.notifications"
        :key="message.id"
        :message="message"
        @read="readMessage(message)"
        @remove-message="removeMessage(message)"
      />
    </div>

    <atomic-empty
      v-else-if="!state.loading"
      class="profile-notifications__empty"
      variant="notification"
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :sub-title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
    />

    <atomic-pagination
      v-if="state.meta?.totalPages && state.meta.totalPages > 1"
      v-bind="state.meta"
      @select-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileNotifications } from '~/types';
  import type { IMessage, INotificationsRequest, IPaginationMeta } from '@skeleton/api/types';
  import { getPlayerNotifications, removePlayerMessage } from '@skeleton/api/notification';

  const globalStore = useGlobalStore();
  const { layoutData, defaultLocaleLayoutData, alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const notificationStore = useNotificationStore();
  const { unreadCount, popoverNotifications } = storeToRefs(notificationStore);
  const { readAllMessages } = notificationStore;
  const { showAlert } = useLayoutStore();

  interface IState {
    loading: boolean;
    notifications: IMessage[];
    meta?: IPaginationMeta;
  }

  const state = reactive<IState>({
    loading: false,
    notifications: [],
    meta: undefined,
  });

  const requestParams = reactive<INotificationsRequest>({
    page: 1,
    perPage: 5,
  });

  const getNotifications = async (): Promise<void> => {
    if (state.loading) return;
    state.loading = true;

    try {
      const { data, meta } = await getPlayerNotifications(requestParams);
      state.notifications = data;
      state.meta = meta;
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    state.loading = false;
  };

  const changePage = (page: number): void => {
    if (state.loading) return;
    requestParams.page = page;
    window.scroll(0, 0);
    getNotifications();
  };

  const contentParams = {
    contentKey: 'profileNotificationsContent',
    contentCollection: 'profile',
    contentSource: 'notifications',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileNotifications>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, getContentData);

  const readMessage = (messageInfo: IMessage): void => {
    state.notifications = state.notifications.map(message => {
      if (messageInfo.id === message.id) return { ...message, readAt: new Date().toISOString(), state: 2 };
      return message;
    });
  };

  const markAllAsRead = (): void => {
    state.notifications = state.notifications.map(message => {
      return { ...message, readAt: new Date().toISOString(), state: 2 };
    });
  };

  const readAllSending = ref(false);
  const readAll = async (): Promise<void> => {
    if (readAllSending.value) return;
    readAllSending.value = true;

    try {
      await readAllMessages();
      markAllAsRead();
    } finally {
      readAllSending.value = false;
    }
  };

  const removingMessage = ref(false);
  const removeMessage = async (message: IMessage): Promise<void> => {
    if (removingMessage.value) return;
    removingMessage.value = true;

    try {
      const response = await removePlayerMessage([message.id]);

      if (state.notifications.length > 1) {
        await getNotifications();
      } else if (state.meta?.page && state.meta.page > 1) {
        requestParams.page = state.meta.page - 1;
        await getNotifications();
      } else {
        state.notifications = [];
        state.meta = undefined;
      }

      if (popoverNotifications.value.some(popoverMessage => popoverMessage.id === message.id)) {
        popoverNotifications.value = state.notifications.slice(0, 3);
      }

      unreadCount.value = response.totalUnread;
    } finally {
      removingMessage.value = false;
    }
  };

  onMounted(async () => {
    await getNotifications();
    useListen('markAsReadMessage', readMessage);
    useListen('newPlayerMessage', getNotifications);
    useListen('markAllAsReadMessages', markAllAsRead);
  });

  onBeforeUnmount(() => {
    useUnlisten('markAsReadMessage', readMessage);
    useUnlisten('newPlayerMessage', getNotifications);
    useUnlisten('markAllAsReadMessages', markAllAsRead);
  });
</script>

<style src="~/assets/styles/pages/profile/notifications.scss" lang="scss" />
