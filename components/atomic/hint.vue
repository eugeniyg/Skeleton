<template>
  <div class="hint" :class="classes" v-show="props.message">
    <atomic-icon v-if="emailIcon" :id="emailIcon"/>
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

<style lang="scss">
.hint {
  @include font($body-1);
  display: flex;
  align-items: center;
  grid-column-gap: rem(4px);
  color: var(--color, var(--gray-400));

  &.variant-error {
    --color: var(--red-500);
  }

  &.variant-success, &.variant-verified {
    --color: var(--green-500);
  }

  &.variant-unverified {
    --color: var(--orange-500);
  }

  &.variant-verified {
    --color: var(--green-500);
  }
}
</style>
