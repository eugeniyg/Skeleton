<template>
  <div :class="classes">
    <atomic-icon v-if="props.titleIcon" :id="props.titleIcon"/>

    <div v-if="props.name && props.subTitle" class="titles">
      <h2 class="title">{{ props.name }}</h2>
      <h4 class="sub-title">{{ props.subTitle }}</h4>
    </div>

    <h2 v-else class="title">{{ props.name || props.identity }}</h2>

    <button-base
      v-if="props.showAllBtn"
      class="btn-show-all"
      type="ghost"
      @click="openGames(props.identity)"
    >
      {{ groupContent?.moreButton }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div
      v-if="props.games.length"
      ref="scrollContainer"
      class="items"
      @scroll="scrollHandler"
    >
      <slot
        v-for="game in props.games"
        :key="game.id"
        name="card"
        v-bind="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CardsGroupInterface } from '~/types';

  const props = defineProps({
    games: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: () => '',
      required: false,
    },
    variant: {
      type: String,
      validator: (val: string) => [
        'favorites',
        'recently',
        'hot',
        'turbo',
        'providers',
        'new-relises',
        'latest-winners',
        'promotions',
        'latest',
        'benefits',
      ].includes(val),
      required: false,
    },
    titleIcon: {
      type: String,
      validator: (val: string) => [
        'heart', 'hot', 'turbo-games', 'new', 'bonuses', 'history', '',
      ].includes(val),
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      required: false,
    },
    showAllBtn: {
      type: Boolean,
      default: false,
    },
    showArrows: {
      type: Boolean,
      default: false,
    },
  });

  const { globalComponentsContent } = useGlobalStore();
  const groupContent: CardsGroupInterface | undefined = globalComponentsContent?.cardsGroup;

  const router = useRouter();
  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);

  const scrollHandler = (): void => {
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  const classes = computed(() => (props.variant ? `cards cards-${props.variant}` : 'cards'));

  onMounted(() => {
    if (props.showArrows) {
      scrollHandler();
      showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
    }
  });

  const { localizePath } = useProjectMethods();
  const openGames = (identity: string): void => {
    router.push(localizePath(`/games?category=${identity}`));
  };
</script>

<style lang="scss">
.cards {
  display: grid;
  align-items: center;
  grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-column-gap: var(--column-gap, #{rem(8px)});
  grid-row-gap: var(--row-gap, #{rem(16px)});

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
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

  > .btn-show-all {
    grid-area: btn-show-all;
    @include font($heading-1);

    --font-size: #{rem(12px)};
    --color: var(--gray-500);
    --width: 100%;

    @include media(xs) {
      padding: 0;
      --bg: transparent;

      &:hover {
        --color: var(--white);
      }
    }
  }

  > .arrows {
    grid-area: arrows;
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
    margin: 0 -32px 0;
    padding: 0 32px;
    scroll-padding: 32px;
    grid-column-gap: 8px;
    scroll-snap-type: x mandatory;

    @include media(sm) {
      grid-column-gap: 16px;
      margin:  0;
      padding: 0;
      scroll-padding: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .titles {
    .title {
      @include font($heading-4);
      color: var(--white);
    }

    .sub-title {
      @include font($body-2);
      color: var(--gray-400);
    }
  }
}

.cards-favorites, .cards-recently {
  > .icon, .title {
    display: none;
  }

  > .items {
    align-items: flex-start;
  }

  @include media(xs) {
    grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";

    > .btn-show-all {
      padding: rem(4px) rem(16px);
    }
  }

  @include media(sm) {
    > .icon, > .title {
      display: block;
      @include upd-font($heading-2);
    }

    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
  }
}

.cards-promotions {
  > .items {
    align-items: normal;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--items-column-gap, #{rem(8px)});

    --display: grid;

    @include media(sm) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.cards-benefits {
  > .items {
    align-items: normal;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--items-column-gap, #{rem(8px)});

    --display: grid;

    @include media(sm) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.cards-latest-winners {
  margin-right: #{rem(-16px)};

  .arrows {
    display: var(--arrows-display, none);

    @include media(md) {
      --arrows-display: flex
    }
  }

  > .items {
    padding-right: #{rem(16px)};
  }

  @include media(md) {
    margin-right: 0;

    > .items {
      padding-right: 0;
    }
  }
}
</style>
