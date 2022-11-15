<template>
  <div class="expander">
    <div class="header" :class="{'is-open': open}" @click="toggle">
      <div class="title">{{ props.title }}</div>

      <button-base>
        <atomic-icon id="arrow_expand-open"/>
      </button-base>
    </div>

    <div class="expander__content" ref="content" :style="styles">
      <atomic-text-editor :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      required: false,
    },
  });

  const open = ref<boolean>(props.isOpen);
  const maxHeight = ref<number>(0);

  const styles = computed(() => ({ '--max-height': open.value ? `${maxHeight.value}px` : '0px' }));
  const content = ref<HTMLElement>();

  const toggle = ():void => {
    open.value = !open.value;
    maxHeight.value = open.value ? content.value?.scrollHeight || 0 : 0;
  };

  onMounted(() => {
    maxHeight.value = content.value?.scrollHeight || 0;
  });
</script>

<style lang="scss">
.expander {
  padding: rem(40px) 0 rem(24px) 0;
  border-top: 1px solid var(--gray-700);

  .header {
    display: flex;
    grid-gap: rem(8px);
    padding: 0 rem(16px) 0 0;
    width: 100%;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &.is-open {
      --title-color: var(--yellow-500);
      --btn-rotate: rotate(0);

      .icon {
        --color: var(--yellow-500);
      }
    }

    > .title {
      @include font($heading-4);
      color: var(--title-color, var(--white));
      flex-grow: 1;
      transition: color .2s ease-in-out;
    }

    .btn {
      transform: var(--btn-rotate, rotate(180deg));
      transition: transform .2s ease-in-out;
      --color: var(--white);
      --bg: transparent;
      --padding: 0;
      --width: #{rem(32px)};
      --height: #{rem(32px)};
    }
  }

  .icon {
    --color: var(--gray-400);
  }

  &:last-of-type {
    border-bottom: 1px solid var(--gray-700);
  }

  &__content {
    padding-top: rem(16px);
    overflow: hidden;
    max-height: var(--max-height, 0);
    transition: max-height .2s ease-in-out;
    @include font($body-3-paragraph);
    color: var(--gray-400);

    p {
      @include font($body-3-paragraph);
      color: var(--gray-400);
      margin: rem(8px) 0;
    }

    a {
      @include font($body-3-paragraph);
      color: var(--yellow-500);
    }
  }

  .text-editor {
    margin: 0;
    padding-right: rem(40px);
  }
}
</style>
