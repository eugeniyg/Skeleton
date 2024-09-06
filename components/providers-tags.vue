<template>
  <div class="providers-tags">
    <div class="providers-tags__clear">
      <atomic-icon id="trash" class="providers-tags__clear-icon"/>
      <span class="providers-tags__clear-text">Clear All</span>
    </div>
    <div class="providers-tags__content">
      <div class="providers-tags__items" ref="scrollContainer" @scroll="scrollHandler">
        <div class="providers-tags__item" v-for="tag in tags" :key="tag.identity">
          <span class="providers-tags__item-text">{{ tag.name }}</span>
          <atomic-icon id="close" class="providers-tags__item-icon"/>
        </div>
      </div>
      
      <div class="providers-tags__buttons">
        <div class="providers-tags__prev" @click="clickAction('prev')" :class="{ 'is-disabled': prevDisabled }">
          <atomic-icon id="arrow_expand-close"/>
        </div>
        <div class="providers-tags__next" @click="clickAction('next')" :class="{ 'is-disabled': nextDisabled }">
          <atomic-icon id="arrow_expand-close"/>
        </div>
      </div>
    </div>
    
    
    
    
    
    
    
    
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    selected: string[]
  }>();
  
  const tags = ref([
    {
      identity: '1',
      name: 'Betsoft Gaming',
    },
    {
      identity: '2',
      name: 'Turbo Games',
    },
    {
      identity: '3',
      name: '1spin4win',
    },
    {
      identity: '1',
      name: 'Betsoft Gaming',
    },
    {
      identity: '2',
      name: 'Turbo Games',
    },
    {
      identity: '3',
      name: '1spin4win',
    },
    {
      identity: '1',
      name: 'Betsoft Gaming',
    },
    {
      identity: '2',
      name: 'Turbo Games',
    },
    {
      identity: '3',
      name: '1spin4win',
    },
    {
      identity: '1',
      name: 'Betsoft Gaming',
    },
    {
      identity: '2',
      name: 'Turbo Games',
    },
    {
      identity: '3',
      name: '1spin4win',
    },
  ]);
  
  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  
  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
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
  
  watch(tags, () => {
    scrollHandler();
  });
  
  onMounted(() => {
    window.addEventListener('resize', scrollHandler);
    scrollHandler()
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', scrollHandler);
  })
</script>

<style src="~/assets/styles/components/providers-tags.scss" lang="scss"/>
