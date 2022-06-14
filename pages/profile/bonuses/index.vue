<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Bonuses</h1>
    </div>
    <tab-bonuses :items="userProfileBonusesTabs"/>
  </div>
</template>

<script setup lang="ts">
  const { userProfileBonusesTabs } = useFakeStore();
</script>
