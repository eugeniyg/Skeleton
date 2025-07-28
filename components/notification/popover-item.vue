<template>
  <div ref="item" class="notification-popover-item" :class="{ 'is-unread': props.messageInfo.state === 1 }">
    <div class="notification-popover-item__header">
      <div class="notification-popover-item__header-date">
        {{ dayjs(props.messageInfo.createdAt).format('DD.MM.YY, HH:mm') }}
      </div>

      <span v-if="props.messageInfo.state === 1" class="notification-popover-item__header-badge">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.newTag') }}
      </span>
    </div>

    <div class="notification-popover-item__title">
      {{ props.messageInfo.content.title }}
    </div>

    <div
      v-if="props.messageInfo.content.body"
      class="notification-popover-item__description"
      :class="{ 'is-text-collapsed': isTextCollapsed }"
    >
      <div ref="textRef" class="notification-popover-item__description-text">
        {{ props.messageInfo.content.body }}
      </div>

      <button-base v-if="isTextCollapsed" type="ghost" @click.stop.prevent="showFullMessage">
        <span>{{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.showFullMessage') }}</span>
        <atomic-icon id="arrow-expand-close" />
      </button-base>
    </div>

    <div v-if="props.messageInfo.content.image" class="notification-popover-item__img">
      <atomic-image :src="`${customerCdn}/${props.messageInfo.content.image}`" />
    </div>

    <div class="notification-popover-item__footer">
      <atomic-divider />

      <atomic-link
        v-if="props.messageInfo.content.link?.url && props.messageInfo.content.link?.label"
        :href="props.messageInfo.content.link.url"
        class="btn-ghost"
        :target-blank="props.messageInfo.content.link?.url.startsWith('http')"
      >
        <span>{{ props.messageInfo.content.link?.label }}</span>
        <atomic-icon id="arrow-next" />
      </atomic-link>

      <div
        class="notification-popover-item__read"
        :class="{ active: props.messageInfo.state === 1 }"
        @click="markAsRead"
      >
        <span>
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.markAsRead') }}
        </span>

        <atomic-icon id="read-all" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IMessage } from '@skeleton/api/types';

  const props = defineProps<{
    messageInfo: IMessage;
  }>();

  const globalStore = useGlobalStore();
  const { layoutData, defaultLocaleLayoutData } = storeToRefs(globalStore);
  const runtimeConfig = useRuntimeConfig();
  const customerCdn = runtimeConfig.public.customerCdn;
  const dayjs = useDayjs();
  const { readMessages } = useNotificationStore();

  const item = ref<HTMLElement>();
  const textRef = ref<HTMLElement>();

  const isTextCollapsed = ref<boolean>(true);

  const descriptionHeight = computed<number>(() => {
    return textRef.value?.scrollHeight || 0;
  });

  const requestSending = ref(false);
  const markAsRead = async (): Promise<void> => {
    if (requestSending.value || props.messageInfo.state === 2) return;
    requestSending.value = true;

    try {
      await readMessages([props.messageInfo.id]);
      useEvent('markAsReadMessage', props.messageInfo);
    } finally {
      requestSending.value = false;
    }
  };

  const showFullMessage = (): void => {
    isTextCollapsed.value = false;
    markAsRead();
  };

  onMounted(() => {
    if (descriptionHeight.value < 32) isTextCollapsed.value = false;
  });
</script>
