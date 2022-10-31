<template>
  <div/>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: [
      function (to) {
        if (to.params.resetCode) {
          return navigateTo(`/?reset-pass=true&resetCode=${to.params.resetCode}`, { replace: true });
        }
        return navigateTo('/', { replace: true });
      },
    ],
  });
</script>
