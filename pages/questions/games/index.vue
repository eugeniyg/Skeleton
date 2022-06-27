<template>
  <div class="content">
    <h1 class="heading">Games</h1>
    <expander :items="accordeons.games"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
