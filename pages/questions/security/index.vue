<template>
  <div class="content">
    <h1 class="heading">Security</h1>
    <expander :items="accordeons.security"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
