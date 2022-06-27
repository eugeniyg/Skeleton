<template>
  <button class="btn-deposit" @click="openDepositModal">
    <atomic-icon id="ui-plus"/>
    <span>Deposit</span>
  </button>
</template>

<script setup lang="ts">
  const { openDepositModal } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss"/>
