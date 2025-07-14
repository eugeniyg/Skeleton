<template>
  <div v-if="latestWinners.length" class="group-winners">
    <atomic-icon
      v-if="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.latestWinners.icon')"
      :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.latestWinners.icon')"
    />

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.latestWinners.label') }}
    </h2>

    <button-arrows
      v-if="showArrowButtons"
      :prev-disabled="prevDisabled"
      :next-disabled="nextDisabled"
      @click-action="clickAction"
    />

    <div ref="scrollContainer" class="items" @scroll="scrollHandler">
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
  import type { IGameWinnerEvent, IWinner } from '@skeleton/core/types';
  import throttle from 'lodash/throttle';

  const props = defineProps({
    showArrows: {
      type: Boolean,
      default: true,
    },
  });

  const winnersSubscription = ref<any>();
  const latestWinners = ref<IWinner[]>([]);

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, isMobile, headerCountry } =
    storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const { getLatestWinners } = useCoreGamesApi();

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < scrollLeft + offsetWidth + 20 && scrollWidth > scrollLeft + offsetWidth - 20;
    showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
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

  const updateWinners = throttle(
    (winnerData: IGameWinnerEvent): void => {
      const { winner } = winnerData.data;
      const filteredWinners = latestWinners.value.filter(item => item.gameId !== winner?.gameId);
      if (winner) latestWinners.value = [winner, ...filteredWinners].slice(0, 12);
    },
    3000,
    { leading: false }
  );

  const subscribeWinnersSocket = (): void => {
    const { createSubscription } = useWebSocket();
    winnersSubscription.value = createSubscription(
      `game:winners:${isMobile.value ? 'mobile' : 'desktop'}:${profile.value?.country || headerCountry.value || 'UA'}`,
      updateWinners
    );
  };

  const unsubscribeWinnersSocket = (): void => {
    if (winnersSubscription.value) {
      winnersSubscription.value.unsubscribe();
      winnersSubscription.value.removeAllListeners();
    }
  };

  watch(latestWinners, () => scrollHandler());

  onMounted(async () => {
    latestWinners.value = await getLatestWinners({
      platform: isMobile.value ? 1 : 2,
      perPage: 12,
      countryCode: profile.value?.country || headerCountry.value || 'UA',
    });
    await nextTick();
    subscribeWinnersSocket();
    useListen('webSocketReconnected', subscribeWinnersSocket);

    if (props.showArrows) {
      scrollHandler();
    }
  });

  onBeforeUnmount(() => {
    unsubscribeWinnersSocket();
    useUnlisten('webSocketReconnected', subscribeWinnersSocket);
  });
</script>

<style src="~/assets/styles/components/group/winners.scss" lang="scss" />
