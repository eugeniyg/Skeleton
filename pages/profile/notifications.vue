<template>
  <div class="profile-notifications content">
    <div class="profile-notifications__header">
      <div class="profile-notifications__title">Notifications</div>
      
      <form-input-checkbox
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
      
      <div class="profile-notifications__content">
        title
        date
        text
        img
        link
        bage
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
  const isNotificationsEnabled = ref<boolean>(true);
  
  const isReadAll = ref<boolean>(false);
</script>

<style src="~/assets/styles/pages/profile/notifications.scss" lang="scss"/>
