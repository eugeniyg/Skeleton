<template>
  <div class="content">
    <h1 class="heading">Most popular</h1>
    <expander :items="accordeons.mostPopular"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
