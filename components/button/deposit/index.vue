<template>
  <button class="btn-deposit" @click="showModal('deposit')">
    <atomic-icon id="ui-plus"/>
  </button>
</template>

<script setup lang="ts">
  const { showModal } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss"/>
