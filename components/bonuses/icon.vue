<template>
  <div class="bonuses-icon" :class="bonusIcon.class">
    <atomic-icon class="bonuses-icon__icon" :id="bonusIcon.icon"/>
    <span class="bonuses-icon__label">{{ bonusIcon.label }}</span>
  </div>
</template>


<script setup lang="ts">
  const props = defineProps<{status: 'done'|'missed'}>();
  
  const iconMap = {
    done: {
      icon: 'done',
      class: 'is-done',
      label: 'Done',
    },
    missed: {
      icon: 'cross',
      class: 'is-missed',
      label: 'Missed',
    },
  };
  
  const bonusIcon = computed(() => iconMap[props.status]);
</script>

<style src="~/assets/styles/components/bonuses/icon.scss" lang="scss"/>
