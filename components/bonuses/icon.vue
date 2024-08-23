<template>
  <div class="bonuses-icon" :class="variant.class">
    <atomic-icon class="bonuses-icon__icon" :id="variant.icon"/>
    <span class="bonuses-icon__label">{{ variant.label }}</span>
  </div>
</template>


<script setup lang="ts">
  const props = defineProps<{status: 'done'|'missed'}>();
  
  const iconVariants = {
    done: {
      icon: 'done',
      class: 'is-done',
      label: 'Done',
    },
    missed: {
      icon: 'done',
      class: 'is-missed',
      label: 'Missed',
    },
  };
  
  const variant = computed(() => iconVariants[props.status]);
</script>

<style src="~/assets/styles/components/bonuses/icon.scss" lang="scss"/>
