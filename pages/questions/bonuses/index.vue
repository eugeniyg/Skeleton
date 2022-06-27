<template>
  <div class="content">
    <h1 class="heading">Bonuses</h1>
    <expander :items="accordeons.bonuses"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
