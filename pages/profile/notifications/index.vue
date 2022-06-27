<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Notifications</h1>
      <form-dropdown-base
        value=""
        placeholder="View all"
        name="notification"
        :options="selects.notification"
        :is-disabled="selects.notification"
      />
    </div>

    <list-notifications
      :items="items.notifications"
      :max="10"
      :isShowMarkReadBtn="items.notifications.length"
    />

    <button-load-more v-if="items.notifications.length"/>

    <atomic-empty
      v-if="!items.notifications.length"
      title="There is no data yet!"
      sub-title="You don`t  have any personal notification"
      variant="notification"
    />

  </div>
</template>

<script setup lang="ts">
  const { selects, items } = useFakeStore();
</script>
