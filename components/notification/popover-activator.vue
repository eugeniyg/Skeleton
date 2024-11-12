<template>
  <div
    ref="item"
    class="notification-popover-activator"
    :class="{ 'is-active': props.popoverShow, 'is-contrast': unreadCount }"
    @click.stop.prevent="emit('toggle')"
  >
    <atomic-icon id="notification" />
    <span v-if="unreadCount" class="notification-popover-activator__count">
      {{ unreadCount > 99 ? `${unreadCount}+` : unreadCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    popoverShow: boolean;
  }>();

  const notificationStore = useNotificationStore();
  const { unreadCount } = storeToRefs(notificationStore);

  const item = ref();

  const emit = defineEmits(['toggle']);
</script>

<style src="~/assets/styles/components/notification/popover-activator.scss" lang="scss" />
