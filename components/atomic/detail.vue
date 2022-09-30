<template>
  <div class="detail" :class="{ 'is-open': open }" @resize="updateScrollHeight">
    <div class="header" @click="toggleOpen">
      <div class="title">{{ props.title }}</div>
      <atomic-icon id="arrow_expand-close" />
    </div>

    <div class="detail-content" ref="refItems">
      <atomic-text-editor class="description" :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const open = ref<boolean>(props.isOpen);
  const scrollHeight = ref<number>(0);
  const refItems = ref();

  const toggleOpen = (): void => {
    open.value = !open.value;
    const height = open.value ? scrollHeight.value : 0;
    refItems.value.style.setProperty('--items-height', `${height}px`);
  };

  const updateScrollHeight = (): void => {
    scrollHeight.value = refItems.value.scrollHeight;
  };
  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
    setTimeout(() => {
      updateScrollHeight();
    }, 100);
  });
</script>

<style lang="scss">
.detail {
  background-color: var(--gray-900);
  border-radius: 16px;
  color: var(--gray-400);
  padding: rem(16px) rem(24px);

  .header {
    display: flex;
    align-items: center;
    grid-gap: rem(8px);
    cursor: pointer;
  }

  .title {
    flex-grow: 1;
    color: var(--color, var(--white));
    @include font($heading-3);
    transition: color 0.2s ease-in-out;
  }

  .detail-content {
    padding: 0;
    height: var(--items-height, 0);
    overflow: hidden;
    transition: height 0.2s ease-in-out;
  }

  &.is-open {
    .title {
      --color: var(--yellow-500);
    }

    .icon {
      --color: var(--yellow-500);
      --transform: rotate(-180deg);
    }

    .detail-content {
      max-height: 100%;
    }
  }

  .icon {
    transform: var(--transform, rotate(0deg));
    transition: all 0.2s ease-in-out;
    --color: var(--gray-500);
  }

  ol {
    @include font($body-2-paragraph);
    padding: 0;

    li {
      margin: rem(12px) 0;
    }
  }

  ul {
    @include font($body-2-paragraph);
    margin: 0;
    padding: 0 0 0 rem(20px);
    list-style: disc inside;

    li {
      margin: rem(12px) 0;
    }
  }
}
</style>
