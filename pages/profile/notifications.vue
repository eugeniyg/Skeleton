<template>
  <div class="profile-notifications content">
    <div class="profile-notifications__header">
      <div class="profile-notifications__title">Notifications</div>
      
      <form-input-checkbox
        name="toggle-unread"
        v-model:value="isReadAll"
        label="Mark all as read"
        icon="read-all"
      />
      
      <div class="profile-notifications__toggle">
        <div class="profile-notifications__toggle-label">
          Allow push notifications
        </div>
        <form-input-toggle
          name="notifications-toggle"
          :value="isNotificationsEnabled"
          @change="isNotificationsEnabled = !isNotificationsEnabled"
        />
      </div>
    </div>
    
    
    <div class="profile-notifications__content">
      <notifications-accordion
        v-for="item in notifications"
        v-bind="item"
      />
    </div>
    
    <atomic-empty
      class="profile-notifications__empty"
      variant="notification"
      title="There is no data yet!"
      subTitle="You don`t  have any personal notification"
    />
  </div>
</template>

<script setup lang="ts">
  const isNotificationsEnabled = ref<boolean>(true);
  const isReadAll = ref<boolean>(false);
  
  const { notifications } = useFakeStore();
</script>

<style src="~/assets/styles/pages/profile/notifications.scss" lang="scss"/>
