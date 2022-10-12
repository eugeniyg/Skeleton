<template>
  <div class="group-winners" v-if="latestWinners.length">
    <atomic-icon v-if="winnersContent?.icon" :id="winnersContent?.icon"/>

    <h2 class="title">{{ winnersContent?.title }}</h2>

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
  import { LatestWinnersInterface } from '~/types';
  import { useGamesStore } from '~/composables/useGamesStore';

  const props = defineProps({
    showArrows: {
      type: Boolean,
      default: true,
    },
  });

  const globalStore = useGlobalStore();
  const { globalComponentsContent, isMobile } = storeToRefs(globalStore);
  const winnersContent:LatestWinnersInterface|undefined = globalComponentsContent.value?.latestWinners;
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const gameStore = useGamesStore();
  const { latestWinners } = storeToRefs(gameStore);

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);
  const { getLatestWinners } = useCoreGamesApi();

  const scrollHandler = ():void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
    showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
  };

  const clickAction = (direction: string):void => {
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
      countryCode: profile.value?.country || 'UA',
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
  margin-right: #{rem(-16px)};

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
  }

  @include media(md) {
    margin-right: 0;

    > .items {
      padding-right: 0;
    }
  }

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    grid-area: icon;
    --iccon-size: #{rem(20px)};
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
    padding-right: 12px;

    @include media(md) {
      padding-right: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
