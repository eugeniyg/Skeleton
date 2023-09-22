<template>
  <div class="hint" :class="classes" v-show="props.message">
    <atomic-icon :id="emailIcon"/>
    {{ props.message }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['error', 'success', 'unverified', 'verified', ''].includes(val),
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
  });

  const emailIcon = computed(() => {
    switch (props.variant) {
    case 'unverified':
      return 'warning';
    case 'verified':
      return 'done';
    default:
      return null;
    }
  });

  const classes = computed(() => [
    props.variant ? `variant-${props.variant}` : '',
  ]);
</script>

<style src="~/assets/styles/components/atomic/hint.scss" lang="scss" />
