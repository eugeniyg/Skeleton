<template>
  <button class="btn-logout" @click="emit('logout')">
    <atomic-icon id="ui-log-out"/>Log out
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout']);
</script>

<style lang="scss" src="./style.scss"/>
