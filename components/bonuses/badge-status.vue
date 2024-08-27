<template>
  <div class="badge-status" :class="status.class">
    <atomic-icon id="stars" class="badge-status__icon"/>
    <span class="badge-status__label">{{ status.label }}</span>
    <span v-if="props.mode === 'availableNextDeposit'" class="badge-status__text">for next deposit</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    mode: 'active'|'availableNextDeposit'|'available'|'future',
  }>();
  
  const statusesMap = {
    active: {
      class: 'is-active',
      label: 'active',
    },
    available: {
      class: 'is-available',
      label: 'available',
    },
    availableNextDeposit: {
      class: 'is-available',
      label: 'available',
    },
    future: {
      class: 'is-future',
      label: 'future',
    }
  }
  
  const status = computed(() => statusesMap?.[props.mode]);
</script>

<style src="~/assets/styles/components/bonuses/badge-status.scss" lang="scss"/>
