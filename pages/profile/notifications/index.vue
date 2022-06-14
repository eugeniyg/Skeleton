<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Notifications</h1>
      <form-dropdown-base
        value=""
        placeholder="View all"
        name="notification"
        :options="selects.notification"
      />
    </div>

    <list-notifications :items="items.notifications" :max="10"/>
    <button-load-more/>
  </div>
</template>

<script setup lang="ts">
  const { selects, items } = useFakeStore();
</script>
