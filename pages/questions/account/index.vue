<template>
  <div class="content">
    <h1 class="heading">Account</h1>
    <expander :items="accordeons.account"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
