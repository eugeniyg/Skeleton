<template>
  <div class="bonuses-badge" :class="badge.class">
    <atomic-icon :id="badge.icon" class="bonuses-badge__icon"/>
    <span class="bonuses-badge__label">{{ badge.label }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    mode: 'package'|'cash'|'percent'|'cashback'|'fs'|'percentFuture'
  }>();
  
  const badgeVariants = {
    package: {
      class: 'is-package',
      label: 'package',
      icon: 'bonuses',
    },
    cash: {
      class: 'is-cash',
      label: 'cash',
      icon: 'cash',
    },
    percent: {
      class: 'is-percent',
      label: 'percent',
      icon: 'percent',
    },
    percentFuture: {
      class: 'is-percent-future',
      label: 'percent',
      icon: 'percent',
    },
    cashback: {
      class: 'is-cashback',
      label: 'cashback',
      icon: 'cashback',
    },
    fs: {
      class: 'is-fs',
      label: 'fs',
      icon: 'clover',
    }
  };
  
  const badge = computed(() => badgeVariants[props.mode]);
  
  
  
</script>

<style src="~/assets/styles/components/bonuses/badge-type.scss" lang="scss"/>
