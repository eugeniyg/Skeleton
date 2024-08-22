<template>
  <div
    v-click-outside="hideTrigger"
    class="notification-popover"
  >
    <div
      class="notifications-popover__header"
    >
      <div class="notifications-popover__count">2 new notifications</div>

      <form-input-checkbox
        :value="true"
        name="notifications-toggle"
        label="Mark all as read"
        icon="read-all"
      />

      <atomic-divider/>
    </div>

    <template v-if="popoverNotifications.length">
      <div
        class="notifications-popover__items"
      >
        Item
        <!--      <notifications-popover-item-->
        <!--        v-for="(notification, index) in notifications"-->
        <!--        :key="index"-->
        <!--        :item="notification"-->
        <!--        :read-all="readAll"-->
        <!--      />-->
      </div>

      <div
        class="notifications-popover__footer"
      >
        <button-base type="ghost">See all</button-base>
      </div>
    </template>

    <atomic-empty
      v-else
      title="Nothing found"
      sub-title="Try searching for something else"
      variant="notification"
    />
  </div>
</template>

<script setup lang="ts">
  const notificationStore = useNotificationStore();
  const { popoverNotifications } = storeToRefs(notificationStore);
  
  const emit = defineEmits(['hide']);

  const hideTrigger = (): void => {
    emit('hide');
  };
</script>

<style src="~/assets/styles/components/notification/popover.scss" lang="scss"/>