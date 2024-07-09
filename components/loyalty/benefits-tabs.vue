<template>
  <div class="loyalty-benefits-tabs">
    <div
      class="loyalty-benefits-tabs__nav"
      :class="{
        'has-left-offset': hasLeftOffset,
        'has-right-offset': hasRightOffset
      }"
    >
      <div
        ref="scrollBlock"
        class="loyalty-benefits-tabs__nav-scroll"
        @scroll="handleScroll"
      >
        <div
          v-for="(item, index) in props.content.items"
          class="loyalty-benefits-tabs__nav-item"
          :class="{'is-active': index === selectedTabIndex}"
          @click="selectTab(index)"
          :key="index"
        >
          <atomic-image class="loyalty-benefits-tabs__nav-item-image" :src="item.image"/>
          <div class="loyalty-benefits-tabs__nav-item-title">{{ item.title }}</div>
        </div>
      </div>
    </div>
    
    <div class="loyalty-benefits-tabs__items" :class="{'is-numeric': props.content.isNumeric}">
      <loyalty-benefits-item v-for="(item, index) in activeTabContent" v-bind="item" :key="index"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['benefits']['tabs'];
  }>();
  
  const selectedTabIndex = ref<number>(0);
  const scrollBlock = ref();
  const hasLeftOffset = ref<boolean>(false);
  const hasRightOffset = ref<boolean>(false);
  
  const activeTabContent = computed(() => props.content.items?.[selectedTabIndex.value]?.items);
  
  const selectTab = (tabIndex: number) => {
    selectedTabIndex.value = tabIndex;
  };
  
  const handleScroll = (): void => {
    const hasScroll = scrollBlock.value.scrollWidth > scrollBlock.value.clientWidth;
    const scrolledToRight = scrollBlock.value.scrollWidth - scrollBlock.value.scrollLeft !== scrollBlock.value.clientWidth;
    
    hasLeftOffset.value = scrollBlock.value.scrollLeft !== 0;
    hasRightOffset.value = hasScroll && scrolledToRight;
  };
  
  onMounted(() => {
    handleScroll();
  })
  
</script>

<style src="~/assets/styles/components/loyalty/benefits-tabs.scss" lang="scss"/>
