<template>
  <div class="badge-status" :class="status.class">
    <atomic-icon id="stars" class="badge-status__icon"/>
    <span class="badge-status__label">{{ status.label }}</span>
    <span v-if="isNextDeposit" class="badge-status__text">for next deposit</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    status: 'active'|'available'|'future',
    isNextDeposit?: boolean,
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
    future: {
      class: 'is-future',
      label: 'future',
    }
  }
  
  const status = computed(() => statusesMap?.[props.status]);
</script>

<style src="~/assets/styles/components/bonuses/badge-status.scss" lang="scss"/>
