<template>
  <div class="accumulated-rewards">
    <div class="accumulated-rewards__content">
      <div class="accumulated-rewards__content-label">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.accumulatedRewards.title') }}:
      </div>

      <div class="accumulated-rewards__amount">
        <div class="accumulated-rewards__amount-current">
          <div class="accumulated-rewards__amount-value">0.00000013</div>
          <div class="accumulated-rewards__amount-currency">mBTC</div>
        </div>

        <div
          v-if="currencies"
          ref="content"
          class="accumulated-rewards__list"
          @inview="checkRewardsWidth"
        >
          <div ref="list" class="accumulated-rewards__list-items">
            <div
              v-for="item in visibleItems"
              ref="items"
              class="accumulated-rewards__list-item"
            >
              <span class="accumulated-rewards__list-item-value">{{ item.value }}</span>
              <span class="accumulated-rewards__list-item-currency">{{ item.currency }}</span>
            </div>
          </div>

          <div
            v-if="hiddenItemsCount"
            class="accumulated-rewards__list-more"
            @click="showModal('questAccumulatedRewards')"
          >
            <span>+</span>
            <span>{{ hiddenItemsCount }}</span>
            <span>{{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.moreLabel') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="accumulated-rewards__img">
      <atomic-image :src="getContent(popupsData, defaultLocalePopupsData, 'questsHub.accumulatedRewards.image')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const globalStore = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);

  const { showModal } = useLayoutStore();
  const currencies = [
    { value: '1.000.000', currency: 'INR' },
    { value: '174', currency: 'PLN' },
    { value: '1.000.000', currency: 'GLD' },
    { value: '1.000.000', currency: 'HLP' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' },
    { value: '1.000.000', currency: 'DRM' }
  ];

  const visibleItems = ref([]);
  const content = ref();
  const list = ref();
  const items = ref<HTMLElement[]>([]);
  const hiddenItemsCount = ref(0);
  const checkRewardsWidth = async (): Promise<void> => {
    visibleItems.value = currencies;
    await nextTick();

    const contentWidth = content.value.offsetWidth;
    const listWidth = list.value.offsetWidth;

    if (listWidth > contentWidth) {
      let totalItemsWidth = 0;
      let totalAvailableItems = 0;
      for (const item of items.value) {
        totalItemsWidth += item.offsetWidth;
        if (totalItemsWidth >= contentWidth) {
          totalAvailableItems = items.value.indexOf(item);
          break;
        }
      }

      visibleItems.value = currencies.slice(0, totalAvailableItems - 1);
      hiddenItemsCount.value = currencies.length - visibleItems.value.length;
    }
  }

  const observer = ref();
  onMounted(() => {
    observer.value = new ResizeObserver(checkRewardsWidth);
    observer.value.observe(content.value);
  });

  onBeforeUnmount(() => {
    observer.value?.unobserve(content.value);
  });
</script>

<style src="~/assets/styles/components/quest/accumulated-rewards.scss" lang="scss"/>