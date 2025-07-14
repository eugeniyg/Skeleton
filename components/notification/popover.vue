<template>
  <div v-click-outside="hideTrigger" class="notification-popover">
    <div class="notification-popover__header">
      <div class="notification-popover__count">
        {{ notificationsCountLabel }}
      </div>

      <div class="notification-popover__read-all" :class="{ active: unreadCount }" @click="readAll">
        <span>
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.markAsReadAll') }}
        </span>
        <atomic-icon id="read-all" />
      </div>

      <atomic-divider />
    </div>

    <template v-if="popoverNotifications.length">
      <div class="notification-popover__items">
        <notification-popover-item v-for="message in popoverNotifications" :key="message.id" :message-info="message" />
      </div>

      <div class="notification-popover__footer">
        <atomic-link href="/profile/notifications" @click="emit('hide')">
          <button-base type="ghost">
            {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.seeAll') }}
          </button-base>
        </atomic-link>
      </div>
    </template>

    <div v-else class="notification-popover__empty">
      <div class="notification-popover__empty-title">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.empty.title') }}
      </div>

      <div class="notification-popover__empty-description">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.empty.description') }}
      </div>

      <atomic-icon-colored id="empty-notification" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const notificationStore = useNotificationStore();
  const { unreadCount, popoverNotifications } = storeToRefs(notificationStore);
  const globalStore = useGlobalStore();
  const { layoutData, defaultLocaleLayoutData } = storeToRefs(globalStore);
  const { readAllMessages } = notificationStore;

  const emit = defineEmits(['hide']);

  const hideTrigger = (): void => {
    emit('hide');
  };

  const notificationsCountLabel = computed(() => {
    const label = getContent(
      layoutData.value,
      defaultLocaleLayoutData.value,
      'header.notificationBox.unreadNotifications'
    );
    return label ? label.replace('{count}', unreadCount.value) : '';
  });

  const readAllSending = ref(false);
  const readAll = async (): Promise<void> => {
    if (readAllSending.value) return;
    readAllSending.value = true;

    try {
      await readAllMessages();
      useEvent('markAllAsReadMessages');
    } finally {
      readAllSending.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/notification/popover.scss" lang="scss" />
