<template>
  <form class="get-file">
    <div class="get-file__title">{{ props.title }}</div>
    <div
      ref="excerpt"
      data-exerpt
      :class="['get-file__description', {'is-expanded': isTextExpanded}]"
      v-html="props.description"
    />

    <button class="show-more-btn" @click.prevent="clickAction" v-show="isShowMoreBtn">More info</button>

    <div class="dropzones-list">
      <dropzone
        v-for="item in dropzones"
        v-bind="item"
        :key="item"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
  import { DropZoneInterface } from '~/types';

  const excerpt = ref(null);
  const isShowMoreBtn = ref<boolean>(false);
  const isTextExpanded = ref<boolean>(false);

  const props = defineProps<{
    title: string,
    description: string,
    dropzones: DropZoneInterface[],
  }>();

  const textHasDots = (el: HTMLElement): boolean => el.scrollHeight > el.offsetHeight;

  const clickAction = () => {
    isTextExpanded.value = true;
    isShowMoreBtn.value = false;
  };

  onMounted(() => {
    if (textHasDots(excerpt.value)) {
      isShowMoreBtn.value = true;
    }
  });
</script>

<style lang="scss">
@mixin line-clamp($rows: 3) {
  display: -webkit-box;
  -webkit-line-clamp: $rows;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.get-file {
  padding: rem(24px);
  background-color: var(--gray-900);
  border-radius: 16px;

  &__title {
    @include font($heading-4);
    margin: 0 0 rem(4px);
    padding: 0;
    color: var(--white);
    text-align: center;
  }

  &__description {
    @include font($heading-1);
    margin: 0 0 rem(24px);
    padding: 0;
    color: var(--gray-400);
    text-align: center;

    p {
      padding: 0;
      margin: 0;

      + p {
        margin-top: rem(8px);
      }
    }

    &[data-exerpt] {
      @include line-clamp(2);
      &.is-expanded {
       display: block;
      }
    }
  }

  .show-more-btn {
    @extend %skip-btn;
    text-decoration: none;
    @include font($body-1-paragraph);
    color: var(--white);
    margin: -24px auto 24px;
    display: block;
  }

  &__files {
    display: grid;
    grid-gap: rem(16px);

    @include media(md) {
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
    }
  }

  .btn-submit {
    margin: rem(16px) auto 0;
  }
}

.dropzones-list {
  display: grid;
  grid-gap: rem(16px);

  @include media(sm) {
    grid-auto-flow: column;
  }
}
</style>
