<template>
  <h1 style="color: white">{{ tournamentIdentity }}</h1>
</template>

<script setup lang="ts">
  const route = useRoute();
  const tournamentIdentity = route.params.identity;
</script>
