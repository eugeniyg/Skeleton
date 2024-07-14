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
          v-for="(tab, index) in props.tabs"
          class="loyalty-benefits-tabs__nav-item"
          :class="{'is-active': index === selectedTabIndex}"
          @click="selectTab(index)"
          :key="index"
        >
          <atomic-image v-if="tab.tabImage" class="loyalty-benefits-tabs__nav-item-image" :src="tab.tabImage"/>
          <div class="loyalty-benefits-tabs__nav-item-title">{{ tab.tabLabel || (index + 1) }}</div>
        </div>
      </div>
    </div>

    <div class="loyalty-benefits-tabs__items" :class="{ 'is-numeric': props.numberedList }">
      <loyalty-benefits-item
        v-for="(benefit, index) in activeTabContent"
        v-bind="benefit"
        :key="`tab-${selectedTabIndex}-benefit-${index}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBenefitsTab } from '~/types';

  const props = defineProps<{
    tabs: IBenefitsTab[];
    numberedList?: boolean
  }>();

  const selectedTabIndex = ref<number>(0);
  const scrollBlock = ref();
  const hasLeftOffset = ref<boolean>(false);
  const hasRightOffset = ref<boolean>(false);

  const activeTabContent = computed(() => props.tabs[selectedTabIndex.value]?.benefits);

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