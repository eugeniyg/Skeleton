<template>
  <notifications
    :position="isMobile ? 'bottom center' : 'top right'"
    :duration="5000"
    :speed="200"
    :width="328"
    pauseOnHover
  >
    <template #body="{ item, close}">
      <div class="alert" :class="`variant-${item.type}`">
        <atomic-icon :id="types[item.type]" />

        <div class="content">
          <div v-if="item.title" class="title">
            {{ item.title }}
          </div>
          <p
            v-if="item.text"
            class="text"
            v-html="item.text"
          />
        </div>

        <button class="btn-alert-close">
          <atomic-icon id="close" @click="close" />
        </button>
      </div>
    </template>
  </notifications>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const types: {[index: string]: string} = {
    info: 'info',
    error: 'warning',
    warning: 'info',
    done: 'done',
    pending: 'clock',
  };
</script>

<style lang="scss">
.alert {
  margin-top: 12px;
  background-color: var(--gray-900);
  padding: rem(16px);
  display: flex;
  grid-column-gap: rem(8px);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  align-items: center;

  .title {
    @include font($heading-2);
    color: var(--white);
    margin: 0;
    padding: 0;
  }

  .content {
    flex-grow: 1;
  }

  .text {
    @include font($body-1);
    color: var(--white);
    margin: 0;
    padding: 0;
  }

  .btn-alert-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(24px);
    height: rem(24px);
    @extend %skip-btn;
    padding: 0;
    align-self: flex-start;

    .icon {
      --icon-size: 22px;
      --color: var(--gray-400);
    }

    &:hover {
      cursor: pointer;

      .icon {
        --color: var(--white);
      }
    }
  }

  &.variant-info {
    > .icon {
      --color: var(--gray-400);
    }
  }

  &.variant-error {
    > .icon {
      --color: var(--red-500);
    }
  }

  &.variant-done {
    > .icon {
      --color: var(--green-500);
    }
  }

  &.variant-warning,
  &.variant-pending {
    > .icon {
      --color: var(--yellow-500);
    }
  }
}
</style>
