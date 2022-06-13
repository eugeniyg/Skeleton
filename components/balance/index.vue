<template>
  <div class="balance">
    <div class="row">
      <div class="label">Balance</div>
      <div class="value">{{ '79.40' }} {{ 'EUR' }}</div>
    </div>

    <div class="row" v-if="props.withdraw">
      <div class="label">Withdraw</div>
      <div class="value">{{ '54.73' }} {{ 'EUR' }}</div>
    </div>
    <atomic-divider />
    <slot/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    withdraw: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
