<template>
  <div>
    <form-input-providers v-model:value="inputValue"/>
    <pre style="color: white">{{ inputValue }}</pre>
  </div>
</template>

<script setup lang="ts">
  const inputValue = ref<string[]>([]);
</script>
