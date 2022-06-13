<template>
  <div class="empty" :class="currentClass">
    <atomic-icon-colored :id="currentIcon"/>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title">{{ props.subTitle }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'transactions',
        'notification',
        'bonuses',
        'bets-history',
      ].includes(val),
      default: 'transactions',
    },
    title: {
      type: String,
      default: 'There is no data yet!',
    },
    subTitle: {
      type: String,
      default: 'You don`t  have any personal notification',
    },
  });

  const currentClass = computed(() => `variant-${props.variant}`);
  const currentIcon = computed(() => `empty-${props.variant}`);
</script>

<style lang="scss" src="./style.scss"/>
