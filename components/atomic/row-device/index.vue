<template>
  <div class="row-device">
    <atomic-icon :id="iconId"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      variant: (val) => ['mobile', 'desktop'].includes(val),
    },
  });
  const iconId = computed(() => {
    switch (props.variant) {
    case 'mobile':
      return 'mobile';
    case 'desktop':
      return 'device';
    default:
      return 'desktop';
    }
  });
</script>

<style lang="scss" src="./style.scss"/>
