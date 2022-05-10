<template>
  <div class="input-deposit">
    <div class="amount">
      <span v-for="(item, index) in props.amount" :key="index">{{ item }}</span>
    </div>
    <div class="label">{{ props.label }}</div>
    <button-deposit/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    amount: {
      type: Array,
      default: () => (['0', '.00000000']),
    },
    label: {
      type: String,
      default: 'mBTC',
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
