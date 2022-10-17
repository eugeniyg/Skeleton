<template>
  <div>
    <form-input-providers :providers="gameProviders" v-model:value="inputValue"/>
    <pre style="color: white">{{ inputValue }}</pre>
  </div>
</template>

<script setup lang="ts">
  const { gameProviders } = useGamesStore();
  const inputValue = ref<string[]>([]);
</script>
