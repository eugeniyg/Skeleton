<template>
  <div class="row-status" :class="classes">
    <slot>statusText</slot>
    <atomic-tooltip v-if="variant === 'closed'" :text="props.tooltip"/>
    <atomic-icon v-else :id="iconId"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'current',
        'active',
        'closed',
        'pending',
        'success',
        'failed',
        'unfinished',
        'canceled',
        'rejected',
        'review',
        'processing',
      ].includes(val),
      default: 'current',
    },
    tooltip: {
      type: String,
      required: false,
    },
  });
  const items = {
    active: 'dot',
    current: 'dot',
    closed: 'info',
    pending: 'clock',
    success: 'done',
    failed: 'warning',
    rejected: 'warning',
    unfinished: 'clock',
    review: 'clock',
    processing: 'clock',
    canceled: 'warning',
  };
  const iconId = computed(() => items[props.variant]);
  const classes = computed(() => `is-${props.variant}`);
</script>

<style lang="scss">
.row-status {
  color: var(--color, var(--green-500));
  display: flex;
  align-items: center;
  grid-column-gap: rem(4px);
  @include font($body-2);

  > .icon {
    --color: var(--green-500);
    --icon-size: #{rem(15px)};
    min-width: #{rem(15px)};
  }

  &.is-current, &.is-active {
    --color: var(--green-500);

   > .icon {
      --color: var(--green-500);
    }
  }

  &.is-closed {
    --color: var(--gray-400);

    > .icon {
      --color: var(--gray-400);
    }
  }

  &.is-pending,
  &.is-processing {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-self: flex-start;

    --color: var(--white);

    > .icon {
      --color: var(--yellow-500);
    }
  }

  &.is-success {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-self: flex-start;
    --color: var(--white);

    > .icon {
      --color: var(--green-500);
    }
  }

  &.is-unfinished,
  &.is-review {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-self: flex-start;
    --color: var(--white);

    > .icon {
      --color: var(--orange-500);
    }
  }

  &.is-failed, &.is-canceled, &.is-rejected {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-self: flex-start;
    --color: var(--white);

    > .icon {
      --color: var(--red-500);
    }
  }
}
</style>
