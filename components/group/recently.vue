<template>
  <div class="group-recently">
    <atomic-icon v-if="groupContent?.recentlyPlayed" :id="groupContent.recentlyPlayed.icon"/>

    <h2 class="title">{{ groupContent?.recentlyPlayed?.label }}</h2>

    <button-base
      v-if="showAllBtn"
      class="btn-show-all"
      url="/recently-played"
      type="ghost"
    >
      {{ groupContent?.moreButton }}
    </button-base>

    <div class="items" ref="container">
      <card-simple
        v-for="(game, gameIndex) in currentGames"
        :key="gameIndex"
        v-bind="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GameInterface } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';
  import { CardsGroupInterface } from '~/types';

  const props = defineProps<{
    gamesList: GameInterface[]
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent } = storeToRefs(globalStore);
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent.value?.cardsGroup;

  const showAllBtn = ref<boolean>(true);
  const cardInBlock = ref<number>(20);
  const currentGames = computed(() => props.gamesList.slice(0, cardInBlock.value));
  const container = ref();

  const calcItems = ():void => {
    if (!props.gamesList.length) return;
    const cardSimple:any = document.querySelector('.group-recently .card');
    const containerWidth = getComputedStyle(container.value).width.replace('px', '');
    const cardWidth = getComputedStyle(cardSimple).width.replace('px', '');
    cardInBlock.value = Math.floor(Number(containerWidth) / Number(cardWidth));
  };

  onMounted(async () => {
    calcItems();
  });

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  watch(() => favoriteGames.value, async (newValue:GameInterface[], oldValue:GameInterface[]) => {
    if ((newValue.length === 0 || oldValue.length === 0) && props.gamesList.length) {
      await nextTick();
      calcItems();
    }
  });
</script>

<style lang="scss">
.group-recently {
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

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    display: none;
    grid-area: icon;
    --iccon-size: #{rem(20px)};
    --color: var(--gray-400);

    @include media(sm) {
      display: initial;
    }
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

  > .title {
    display: none;
    flex-grow: 1;
    grid-area: heading;
    @include font($heading-4);
    color: var(--white);
    margin: 0;

    @include media(sm) {
      display: initial;
    }
  }

  > .items {
    grid-area: items;
    display: var(--display, flex);
    align-items: flex-start;
  }
}
</style>
