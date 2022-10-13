<template>
  <form-input-providers :items="providersInputItems"/>
</template>

<script setup lang="ts">
  const { providersInputItems } = useFakeStore();
</script>
