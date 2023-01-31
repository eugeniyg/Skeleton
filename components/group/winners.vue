<template>
  <div class="group-winners" v-if="latestWinners.length">
    <atomic-icon v-if="winnersContent?.latestWinners?.icon" :id="winnersContent.latestWinners.icon"/>

    <h2 class="title">{{ winnersContent?.latestWinners?.label }}</h2>

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
  import { CardsGroupInterface } from '~/types';
  import { useGamesStore } from '~/composables/useGamesStore';

  const props = defineProps({
    showArrows: {
      type: Boolean,
      default: true,
    },
  });
  const globalStore = useGlobalStore();
  const { globalComponentsContent, isMobile, headerCountry } = storeToRefs(globalStore);
  const winnersContent: CardsGroupInterface | undefined = globalComponentsContent.value?.cardsGroup;
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

<style lang="scss">
.group-winners {
  display: grid;
  align-items: center;
  grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-column-gap: var(--column-gap, #{rem(8px)});
  grid-row-gap: var(--row-gap, #{rem(16px)});
  background-color: var(--gray-900);
  border-radius: 16px;
  padding: rem(16px) rem(16px) rem(8px) rem(16px);
  position: relative;

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
    padding: rem(16px) rem(16px) rem(24px) rem(16px);
  }

  @include media(sm) {
    padding: rem(24px);
  }

  @include media(md) {
    padding: rem(24px) rem(24px) rem(16px) rem(24px);

    @include scroll-overlay;
  }

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    grid-area: icon;
    --icon-size: #{rem(20px)};
    --color: var(--gray-400);
  }

  > .arrows {
    display: var(--arrows-display, none);
    grid-area: arrows;

    @include media(md) {
      --arrows-display: flex
    }
  }

  > .title {
    flex-grow: 1;
    grid-area: heading;
    @include font($heading-4);
    color: var(--white);
    margin: 0;
  }

  > .items {
    grid-area: items;
    display: var(--display, flex);
    align-items: center;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    margin: 0 -32px 0;
    padding: 0 32px;
    scroll-padding: 32px;
    grid-column-gap: 8px;

    @include media(sm) {
      grid-column-gap: 16px;
      margin: 0 -56px 0;
      padding: 0 56px;
      scroll-padding: 56px;
    }

    @include media(md) {
      scroll-padding: 0;
      padding: 0;
      margin:  0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
