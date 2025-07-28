<template>
  <button :class="classes" @click="onClick">
    <atomic-icon id="arrow-expand-close" />
  </button>
</template>

<script setup lang="ts">
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const classes = computed(() => ({
    'btn-toggle': true,
    'is-active': props.isActive,
  }));

  const emit = defineEmits(['toggle']);
  function onClick(): void {
    emit('toggle');
  }
</script>

<style src="~/assets/styles/components/button/toggle.scss" lang="scss" />
