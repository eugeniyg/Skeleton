<template>
  <div v-if="tags.length" class="providers-tags">
    <div class="providers-tags__clear" @click="clearTags">
      <atomic-icon id="trash" class="providers-tags__clear-icon" />

      <span class="providers-tags__clear-text">{{ props.clearLabel }}</span>
    </div>

    <div class="providers-tags__content">
      <div ref="scrollContainer" class="providers-tags__items" @scroll="scrollHandler">
        <div v-for="tag in props.tags" :key="tag.id" class="providers-tags__item">
          <span class="providers-tags__item-text">{{ tag.name }}</span>
          <atomic-icon id="close" class="providers-tags__item-icon" @click="unselectTag(tag.id)" />
        </div>
      </div>

      <div class="providers-tags__buttons">
        <div class="providers-tags__prev" :class="{ 'is-disabled': prevDisabled }" @click="clickAction('prev')">
          <atomic-icon id="arrow-expand-close" />
        </div>

        <div class="providers-tags__next" :class="{ 'is-disabled': nextDisabled }" @click="clickAction('next')">
          <atomic-icon id="arrow-expand-close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGameProvider } from '@skeleton/api/types';

  const props = defineProps<{
    clearLabel?: string;
    tags: IGameProvider[];
  }>();

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < scrollLeft + offsetWidth + 20 && scrollWidth > scrollLeft + offsetWidth - 20;
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth, scrollWidth, scrollLeft } = scrollContainer.value;
    const widthToEnd = scrollWidth - (scrollLeft + offsetWidth);
    const scrollLeftValue = widthToEnd < offsetWidth ? widthToEnd : offsetWidth;
    const scrollRightValue = scrollLeft < offsetWidth ? scrollLeft : offsetWidth;

    scrollContainer.value.scrollBy({
      left: direction === 'next' ? scrollLeftValue : -scrollRightValue,
      behavior: 'smooth',
    });
  };

  const emit = defineEmits(['unselect']);
  const unselectTag = (providerId: string) => {
    const idsArr = props.tags.filter(tag => tag.id !== providerId).map(provider => provider.id);
    emit('unselect', idsArr);
  };

  const clearTags = () => {
    emit('unselect', []);
  };

  watch(
    () => props.tags,
    () => {
      nextTick(() => {
        scrollHandler();
      });
    }
  );

  onMounted(() => {
    window.addEventListener('resize', scrollHandler);
    scrollHandler();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', scrollHandler);
  });
</script>

<style src="~/assets/styles/components/providers-tags.scss" lang="scss" />
