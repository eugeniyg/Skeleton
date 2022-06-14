<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">History</h1>
    </div>
    <tab-history :items="userProfileHistoryTabs"/>
  </div>
</template>

<script setup lang="ts">
  const { userProfileHistoryTabs } = useFakeStore();
</script>
