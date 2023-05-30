<template>
  <div class="group-winners" v-if="latestWinners.length">
    <atomic-icon
      v-if="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.latestWinners.icon')"
      :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.latestWinners.icon')"
    />

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.latestWinners.label') }}
    </h2>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div
      ref="scrollContainer"
      class="items"
      @scroll="scrollHandler"
    >
      <card-latest-winners
        v-for="(winner, index) in latestWinners"
        :key="`${index}-${winner.gameId}`"
        v-bind="winner"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    showArrows: {
      type: Boolean,
      default: true,
    },
  });
  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    isMobile,
    headerCountry,
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const gameStore = useGamesStore();
  const { latestWinners } = storeToRefs(gameStore);

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const { getLatestWinners } = useCoreGamesApi();

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
    showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  const { setWinners } = gameStore;
  onMounted(async () => {
    const winnersResponse = await getLatestWinners({
      platform: isMobile.value ? 1 : 2,
      perPage: 12,
      countryCode: profile.value?.country || headerCountry.value || 'UA',
    });
    setWinners(winnersResponse);
    await nextTick();

    if (props.showArrows) {
      scrollHandler();
    }
  });

  watch(() => latestWinners.value, () => scrollHandler());
</script>

<style src="~/assets/styles/components/group/winners.scss" lang="scss" />

