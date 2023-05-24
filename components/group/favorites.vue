<template>
  <div class="group-favorites">
    <atomic-icon
      v-if="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.favorites')"
      :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.favorites.icon')"
    />

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.favorites.label') }}
    </h2>

    <button-base
      v-if="showAllBtn"
      class="btn-show-all"
      url="/favorites"
      type="ghost"
    >
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
    </button-base>

    <div class="items" ref="container">
      <card-simple
        v-for="(favorite, favoriteIndex) in favoriteList"
        :key="favoriteIndex"
        v-bind="favorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const container = ref();

  const showAllBtn = ref<boolean>(true);
  const cardInBlock = ref<number>(20);
  const favoriteList = computed(() => favoriteGames.value.slice(0, cardInBlock.value));

  const calcItems = ():void => {
    if (!favoriteGames.value.length) return;
    const cardSimple:any = document.querySelector('.group-favorites .card');
    const containerWidth = getComputedStyle(container.value).width.replace('px', '');
    const cardWidth = getComputedStyle(cardSimple).width.replace('px', '');
    cardInBlock.value = Math.floor(Number(containerWidth) / Number(cardWidth));
  };

  onMounted(() => {
    calcItems();
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
  grid-column-gap: var(--column-gap, 8px);

  @include media(xs) {
    grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
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
    --icon-size: 20px;
    --color: var(--gray-400);

    @include media(sm) {
      display: initial;
    }
  }

  .btn-show-all {
    grid-area: btn-show-all;
    @include font($heading-1);
    transform: translateX(8px);
    margin-top: 4px;
    --padding: 4px 16px;

    --font-size: #{rem(12px)};
    --color: var(--gray-500);
    --width: 100%;

    @include media(sm) {
      margin-top: 0;
      background: none;

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

    @include media(sm) {
      margin-top: 16px;
    }
  }
}
</style>
