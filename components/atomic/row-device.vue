<template>
  <div class="row-device">
    <atomic-icon :id="iconId" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    variant: 'mobile' | 'desktop';
  }>();

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

<style src="~/assets/styles/components/atomic/row-device.scss" lang="scss" />
