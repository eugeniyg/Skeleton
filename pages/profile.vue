<template>
  <div>  <h1 style="color: white;">
    Hello from Profile page!</h1>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });
</script>
