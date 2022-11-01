<template>
  <div class="alert" :class="classes">
    <atomic-icon :id="currentIcon" />

    <div class="content">
      <div v-if="props.title" class="title">
        {{ props.title }}
      </div>
      <p v-if="props.description" class="text">
        {{ props.description }}
      </p>
    </div>

    <button class="btn-alert-close" @click.prevent="hide">
      <atomic-icon id="close" />
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
  });

  const types = {
    info: 'info',
    error: 'warning',
    warning: 'info',
    done: 'done',
    pending: 'clock',
  };

  const { hideAlert } = useLayoutStore();

  const timer = ref<any>();

  const setTimer = ():void => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      hideAlert();
    }, 5000);
  };

  const hide = ():void => {
    if (props.autoHide) { clearTimeout(timer.value); }
    hideAlert();
  };

  watch(() => props.isShow, (newValue:boolean) => {
    if (newValue && props.autoHide) {
      setTimer();
    }
  });

  const classes = computed(() => [{
    'is-show': props.isShow,
  }, `variant-${props.type}`]);

  const currentIcon = computed(() => types[props.type]);

  onBeforeUnmount(() => {
    clearTimeout(timer.value);
  });
</script>

<style lang="scss">
.alert {
  position: fixed;
  z-index: 9999;
  max-width: rem(328px);
  background-color: var(--gray-900);
  padding: rem(16px);
  display: flex;
  grid-column-gap: rem(8px);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  visibility: var(--visibility, hidden);
  opacity: var(--opacity, 0);
  transition: all .2s ease-in-out;
  margin: 0 auto;
  bottom: var(--bottom, #{72px});
  right: var(--right, #{rem(16px)});
  left: var(--left, #{rem(16px)});
  top: var(--top, initial);
  align-items: center;

  @include media(md) {
    width: 100%;
    --top: #{rem(72px)};
    --right: #{rem(32px)};
    --left: auto;
    --bottom: auto;
  }

  &.is-show {
    --visibility: visible;
    --opacity: 1;
  }

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
