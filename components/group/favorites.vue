<template>
  <div class="group-favorites">
    <atomic-icon v-if="groupContent?.favorites" :id="groupContent.favorites.icon"/>

    <h2 class="title">{{ groupContent?.favorites.label }}</h2>

    <button-base
      v-if="showAllBtn"
      class="btn-show-all"
      url="/favorites"
      type="ghost"
    >
      {{ groupContent?.moreButton }}
    </button-base>

    <div class="items" ref="container">
      <card-simple
        ref="cardSimple"
        v-for="(favorite, favoriteIndex) in favoriteList"
        :key="favoriteIndex"
        v-bind="favorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CardsGroupInterface } from '~/types';

  const { globalComponentsContent } = useGlobalStore();
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent?.cardsGroup;

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);

  const showAllBtn = ref<boolean>(true);
  const cardInBlock = ref<number>(4);
  const favoriteList = computed(() => favoriteGames.value.slice(0, cardInBlock.value));
  const container = ref();

  const calcItems = ():void => {
    const cardSimple:any = document.querySelector('.group-favorites .card');
    const containerWidth = getComputedStyle(container.value).width.replace('px', '');
    const cardWidth = getComputedStyle(cardSimple).width.replace('px', '');
    cardInBlock.value = Math.floor(Number(containerWidth) / Number(cardWidth));
  };

  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
    setTimeout(() => {
      calcItems();
    }, 100);
  });
</script>

<style lang="scss">
.group-favorites {
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
    grid-area: icon;
    --iccon-size: #{rem(20px)};
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
    align-items: flex-start;
    @extend %cards-items-negative;
  }
}
</style>
