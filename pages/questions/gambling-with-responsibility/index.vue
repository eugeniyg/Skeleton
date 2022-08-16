<template>
  <div class="content">
    <h1 class="heading">Gambling with responsibility</h1>
    <expander :items="accordeons.responsibleGaming"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
