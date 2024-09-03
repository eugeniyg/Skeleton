<template>
  <div class="profile-notifications content">
    <div class="profile-notifications__header">
      <div class="profile-notifications__title">
        {{ getContent(notificationsContent, defaultLocaleNotificationsContent, 'title') }}
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
        @removeMessage="removeMessage(message)"
      />
    </div>

    <atomic-empty
      v-else-if="!state.loading"
      class="profile-notifications__empty"
      variant="notification"
      :title="getContent(notificationsContent, defaultLocaleNotificationsContent, 'empty.title')"
      :subTitle="getContent(notificationsContent, defaultLocaleNotificationsContent, 'empty.description')"
    />

    <atomic-pagination
      v-if="state.meta?.totalPages && state.meta.totalPages > 1"
      v-bind="state.meta"
      @selectPage="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileNotifications } from "~/types";
  import {storeToRefs} from "pinia";
  import type {IMessage, INotificationsRequest, IPaginationMeta} from "@skeleton/core/types";

  const globalStore = useGlobalStore();
  const {
    currentLocale,
    defaultLocale,
    layoutData,
    defaultLocaleLayoutData,
    alertsData,
    defaultLocaleAlertsData
  } = storeToRefs(globalStore);
  const { setPageMeta, getLocalesContentData, getContent } = useProjectMethods();
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
    meta: undefined
  });

  const requestParams = reactive<INotificationsRequest>({
    page: 1,
    perPage: 5
  });

  const { getPlayerNotifications, removePlayerMessage } = useCoreNotificationApi();
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
  }

  const changePage = (page: number):void => {
    if (state.loading) return;
    requestParams.page = page;
    window.scroll(0, 0);
    getNotifications();
  };

  const notificationsContent = ref<Maybe<IProfileNotifications>>();
  const defaultLocaleNotificationsContent = ref<Maybe<IProfileNotifications>>();
  
  interface IPageContent {
    currentLocaleData: Maybe<IProfileNotifications>;
    defaultLocaleData: Maybe<IProfileNotifications>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    notificationsContent.value = contentData?.currentLocaleData;
    defaultLocaleNotificationsContent.value = contentData?.defaultLocaleData;
    setPageMeta(notificationsContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileNotificationsContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'notifications').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : queryContent(defaultLocale.value?.code as string, 'profile', 'notifications').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileNotificationsContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });

  const readMessage = (messageInfo: IMessage): void => {
    state.notifications = state.notifications.map(message => {
      if (messageInfo.id === message.id) return { ...message, readAt: new Date().toISOString(), state: 2 };
      return message;
    });
  }

  const markAllAsRead = (): void => {
    state.notifications = state.notifications.map(message => {
      return { ...message, readAt: new Date().toISOString(), state: 2 };
    });
  }

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
  }

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
        popoverNotifications.value = state.notifications.slice(0,3);
      }

      unreadCount.value = response.totalUnread;
    } finally {
      removingMessage.value = false;
    }
  }
  
  onMounted(async () => {
    await getNotifications();
    useListen('markAsReadMessage', readMessage);
    useListen('newPlayerMessage', getNotifications);
    useListen('markAllAsReadMessages', markAllAsRead);
  })

  onBeforeUnmount(() => {
    useUnlisten('markAsReadMessage', readMessage);
    useUnlisten('newPlayerMessage', getNotifications);
    useUnlisten('markAllAsReadMessages', markAllAsRead);
  })
</script>

<style src="~/assets/styles/pages/profile/notifications.scss" lang="scss"/>