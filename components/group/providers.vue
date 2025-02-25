<template>
  <div class="group-providers">
    <atomic-icon
      :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.providers.icon')"
    />

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.providers.label') }}
    </h2>

    <button-base
      v-if="props.showAllBtn && activeProvidersCount"
      class="btn-show-all"
      type="ghost"
      size="sm"
      url="/providers"
    >
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
      {{ activeProvidersCount }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prev-disabled="prevDisabled"
      :next-disabled="nextDisabled"
      @click-action="clickAction"
    />

    <div v-if="providersList.length" ref="scrollContainer" class="items" @scroll="scrollHandler">
      <card-providers v-for="provider in providersList" :key="provider.id" :provider-data="provider" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGameProvider } from '@skeleton/core/types';

  const props = defineProps<{
    showAllBtn?: boolean;
    showArrows?: boolean;
  }>();

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { getProviderList } = useGamesStore();
  const { data: gameProviders } = await useLazyAsyncData(() => getProviderList(), { server: false });
  const contentList: { identity: string }[] =
    getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.providers.items') || [];

  const providersList = computed(() => {
    const providersArr: IGameProvider[] = [];
    contentList.forEach(contentProvider => {
      const providerData = gameProviders.value?.find(provider => provider.identity === contentProvider.identity);
      if (providerData) providersArr.push(providerData);
    });
    return providersArr;
  });

  const activeProvidersCount = computed(() => {
    const filteredArr = gameProviders.value?.filter(provider => !!provider.gameEnabledCount) || [];
    return filteredArr.length;
  });

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < scrollLeft + offsetWidth + 20 && scrollWidth > scrollLeft + offsetWidth - 20;
  };

  watch(gameProviders, () => {
    scrollHandler();
  });

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

  onMounted(() => {
    if (props.showArrows) {
      scrollHandler();
      showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
    }
  });
</script>

<style src="~/assets/styles/components/group/providers.scss" lang="scss" />
