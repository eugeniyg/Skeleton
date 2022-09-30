<template>
  <div class="empty" :class="currentClass">
    <img
      class="empty__image"
      v-if="props.image"
      :src="props.image"
      alt=""
    >
    <atomic-icon-colored v-else-if="currentIcon" :id="currentIcon"/>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title">{{ props.subTitle }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'transactions',
        'notification',
        'bonuses',
        'bets-history',
      ].includes(val),
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
  });

  const currentClass = computed(() => (props.variant ? `variant-${props.variant}` : undefined));
  const currentIcon = computed(() => (props.variant ? `empty-${props.variant}` : undefined));
</script>

<style lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--margin-bottom, #{rem(40px)});

  .title {
    @include font($heading-4);
    color: var(--color, var(--gray-500));
    margin-bottom: var(--margin-bottom, #{rem(8px)});
  }

  .sub-title {
    @include font($body-2);
    color: var(--color, var(--gray-500));
  }

  .icon-colored {
    width: var(--icon-width);
    height: var(--icon-height);
    display: block;
    margin-bottom: var(--margin-bottom, #{rem(16px)});
  }

  &__image {
    display: block;
    width: rem(267px);
    height: auto;
    margin: 0 auto;
  }

  &.variant-bonuses {
    --icon-width: #{rem(240px)};
    --icon-height: #{rem(240px)};
  }

  &.variant-notification {
    --icon-width: #{rem(212px)};
    --icon-height: #{rem(284px)};
  }

  &.variant-bets-history {
    --icon-width: #{rem(240px)};
    --icon-height: #{rem(260px)};
  }

  &.variant-transactions {
    --icon-width: #{rem(240px)};
    --icon-height: #{rem(260px)};
  }
}
</style>
