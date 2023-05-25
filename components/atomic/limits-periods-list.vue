<template>
  <div class="limits-periods-list" :class="{'is-show-edit': props.isShowEdit}">
    <div
      :key="period.title"
      class="limits-periods-list__column"
      v-for="period in props.periods"
    >
      <h4 class="limits-periods-list__title">
        {{ limitsContent?.periodOptions[period.title] ||  defaultLimitsContent?.periodOptions[period.title] }}
      </h4>

      <div class="limits-periods-list__items">
        <atomic-period-item
          v-for="item in period.items"
          v-bind="item"
          :is-show-edit="isShowEdit"
          :key="item.id + item.updatedAt"
          @edit-limit="emit('open-edit-modal', { ...item, limitId: item.id  })"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PlayerLimitInterface } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    periods: {
      title: string,
      items: PlayerLimitInterface[]
    }[],
    isShowEdit: boolean,
  }>();

  const emit = defineEmits(['open-edit-modal']);

  const limitsStore = useLimitsStore();
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
</script>

<style lang="scss">
.limits-periods-list {
  display: flex;
  flex-direction: column;
  grid-gap: 49px;
  margin-top: 24px;

  @include media(l) {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }

  &__title {
    margin: 0 0 24px;
    @include font($heading-2);
    color: var(--gray-400);
  }

  &__items {
    display: grid;
    grid-gap: 24px;
  }

  &__item {
    position: relative;

    .is-show-edit & {
      display: grid;
      grid-template-columns: 1fr 24px;
      grid-template-rows: repeat(2, auto);
      grid-template-areas:
        "title edit"
        "sub-title edit";
      grid-column-gap: 8px;
    }

    &-edit {
      grid-area: edit;
      border-radius: 8px;
      width: 24px;
      height: 24px;
      --padding: 0;
      --color: var(--gray-400);

      &:active {
        --bg: var(--gray-700);
      }
    }

    &-title {
      margin: 0;
      @include font($heading-2);
      color: var(--white);
      grid-area: title;
    }

    &-sub-title {
      margin: 4px 0 0;
      @include font($body-1);
      color: var(--white);
      grid-area: sub-title;
    }

    &-progress {
      margin-top: 8px;
      height: 4px;
      border-radius: 2px;
      background-color: var(--gray-600);
      position: relative;
      overflow: hidden;
      grid-column: 1/3;

      &.is-full {
        --bg: var(--red-600);
      }

      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: var(--progress-width, 0%);
        background-color: var(--bg, var(--blue-500));
      }
    }

    &-status {
      display: flex;
      align-items: center;
      grid-column-gap: 2px;
      margin-top: 4px;
      grid-column: 1/3;

      &-title {
        margin: 0;
        @include font($body-0);
        color: var(--white);
      }

      &-type {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        &:after {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--bg, var(--yellow-500));
        }

        &--active {
          --bg: var(--green-500)
        }

        &--pending {
          --bg: var(--yellow-500)
        }
      }
    }
  }

  &__column {
    position: relative;

    &:not(:first-of-type) {
      &:after {
        content: '';
        display: block;
        position: absolute;
        top: -25px;
        left: 0;
        right: 0;
        height: 1px;
        background-image: repeating-linear-gradient(
            to right,
            var(--gray-700),
            var(--gray-700) 4px,
            var(--gray-900) 4px,
            var(--gray-900) 8px
        );

        @include media(l) {
          height: auto;
          width: 1px;
          top: 0;
          bottom: 0;
          left: -25px;
          background-image: repeating-linear-gradient(
              to bottom,
              var(--gray-700),
              var(--gray-700) 4px,
              var(--gray-900) 4px,
              var(--gray-900) 8px
          );
        }
      }
    }
  }

  .btn-modal-close {
    transform: translate(0, 0);
    --right: auto;
    --top: 4px;
    --bg: var(--gray-800);

    .icon {
      &:first-of-type {
        --visibility: visible;
      }

      &:last-of-type {
        --visibility: hidden;
      }

      @include media(xs) {
        &:first-of-type {
          --visibility: hidden;
        }

        &:last-of-type {
          --visibility: visible;
        }
      }
    }

    @include media(xs) {
      --top: #{rem(-4px)};
      --right: #{rem(-14px)};
      --bg: transparent;
    }

    @include media(md) {
      --top: #{rem(-16px)};
      --right: #{rem(-14px)};
    }
  }
}

</style>
