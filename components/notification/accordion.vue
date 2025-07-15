<template>
  <div class="notification-accordion" :class="{ 'is-open': isOpen, 'is-unread': props.message.state === 1 }">
    <div class="notification-accordion__header" @click="toggleOpen">
      <button-base type="ghost" class="notification-accordion__toggle">
        <atomic-icon id="arrow-down-compact" />
      </button-base>

      <div class="notification-accordion__header-title">{{ props.message.content.title }}</div>

      <span v-if="props.message.state === 1" class="notification-accordion__header-badge">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBox.newTag') }}
      </span>

      <button-base type="ghost" class="notification-accordion__remove" @click.stop.prevent="emit('removeMessage')">
        <atomic-icon id="trash" />
      </button-base>
    </div>

    <div class="notification-accordion__content">
      <div class="notification-accordion__date">
        {{ dayjs(props.message.createdAt).format('DD.MM.YY, HH:mm') }}
      </div>

      <div class="notification-accordion__description">{{ props.message.content.body }}</div>

      <div v-if="props.message.content.image" class="notification-accordion__image">
        <atomic-image :src="`${customerCdn}/${props.message.content.image}`" />
      </div>

      <atomic-link
        v-if="props.message.content.link?.url && props.message.content.link?.label"
        :href="props.message.content.link.url"
        class="btn-ghost notification-accordion__link"
        :target-blank="props.message.content.link.url.startsWith('http')"
      >
        <span>{{ props.message.content.link.label }}</span>
        <atomic-icon id="arrow-next" />
      </atomic-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IMessage } from '@skeleton/api/types';

  const props = defineProps<{
    message: IMessage;
  }>();

  const emit = defineEmits(['read', 'removeMessage']);

  const globalStore = useGlobalStore();
  const { layoutData, defaultLocaleLayoutData } = storeToRefs(globalStore);
  const dayjs = useDayjs();
  const runtimeConfig = useRuntimeConfig();
  const customerCdn = runtimeConfig.public.customerCdn;
  const { readMessages } = useNotificationStore();

  const isOpen = ref<boolean>(false);

  const toggleOpen = (): void => {
    if (!isOpen.value) markAsRead();
    isOpen.value = !isOpen.value;
  };

  const requestSending = ref(false);
  const markAsRead = async (): Promise<void> => {
    if (requestSending.value || props.message.state === 2) return;
    requestSending.value = true;

    try {
      await readMessages([props.message.id]);
      emit('read');
    } finally {
      requestSending.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/notification/accordion.scss" lang="scss" />
