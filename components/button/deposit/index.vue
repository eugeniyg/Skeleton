<template>
  <button class="btn-deposit" @click="openDepositModal">
    <atomic-icon id="plus"/>
    <span>{{ headerContent?.depositButton }}</span>
  </button>
</template>

<script setup lang="ts">
  const { openDepositModal } = useLayoutStore();
  const { headerContent } = useGlobalStore();
</script>

<style lang="scss" src="./style.scss"/>
