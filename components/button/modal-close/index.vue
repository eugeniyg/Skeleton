<template>
  <button class="btn-modal-close" @click.prevent="emit('close')">
    <atomic-icon id="ui-arrow_previous"/>
    <atomic-icon id="ui-close"/>
  </button>
</template>
<script setup lang="ts">
  const emit = defineEmits(['close']);
</script>

<style lang="scss" src="./style.scss"/>
