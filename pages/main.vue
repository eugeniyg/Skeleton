<template>
  <div>
    <client-only>
      <carousel v-bind="topSliderProps">
        <slide v-for="(props, index) in fakeStore.sliders.main" :key="index">
          <card-promo v-bind="props" />
        </slide>

        <template v-slot:addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </client-only>

    <nav-cat @clickCategory="changeCategory" />

    <!-- <tab-component @select-tab="selectTab" :selected="selectedTabId">
      <tab-item :is-active="selectedTabId === 'favorites'">
        <cards-group v-bind="fakeStore.favoritesCards">
          <template v-slot:card="item">
            <card-simple v-bind="item" :variant="fakeStore.favoritesCards.variant" />
          </template>
        </cards-group>
      </tab-item>

      <tab-item :is-active="selectedTabId === 'recently-played'">
        <cards-group v-bind="fakeStore.recentlyCards">
          <template v-slot:card="item">
            <card-simple v-bind="item" :variant="fakeStore.recentlyCards.variant"/>
          </template>
        </cards-group>
      </tab-item>
    </tab-component> -->

    <br />

    <cards-group v-if="state.mapped[0]?.games?.length" v-bind="state.mapped[0]">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-if="state.mapped[1]?.games?.length" v-bind="state.mapped[1]">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-if="state.mapped[2]?.games?.length" v-bind="state.mapped[2]">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-if="state.mapped[3]?.games?.length" v-bind="state.mapped[3]">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-if="state.mapped[4]?.games?.length" v-bind="state.mapped[4]">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-if="state.mapped[5]?.games?.length" v-bind="state.mapped[5]">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <!-- <cards-group v-bind="fakeStore.newRelisesCards">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.latestWinnersCards">
      <template v-slot:card="item">
        <card-latest-winners v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.promotionsCards">
      <template v-slot:card="item">
        <card-promotions v-bind="item" />
      </template>
    </cards-group>  -->
  </div>
</template>

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css';
  import {
    Carousel, Slide, Pagination, Navigation,
  } from 'vue3-carousel';
  import { useGamesApi } from '~/CORE/index';

  const fakeStore = useFakeStore();
  const router = useRouter();
  const { gameCollections } = useGamesStore();
  const { getFilteredGames } = useGamesApi();

  const mainCategories = {
    hot: 'hot',
    slots: 'slots',
    turbogames: 'turbo-games',
    new: 'new',
    table: 'table-games',
    live: 'live-casino',
  };

  const state = reactive({
    mapped: gameCollections.filter((item) => Object.keys(mainCategories).find((el) => el === item.identity)).sort(
      (a, b) => Object.keys(mainCategories).map((e) => e).indexOf(a.identity)
        - Object.keys(mainCategories).map((e) => e).indexOf(b.identity),
    ),
  });

  onMounted(async () => {
    try {
      const data = await Promise.all([
        getFilteredGames({ collectionId: state.mapped[0].id }),
        getFilteredGames({ collectionId: state.mapped[1].id }),
        getFilteredGames({ collectionId: state.mapped[2].id }),
        getFilteredGames({ collectionId: state.mapped[3].id }),
        getFilteredGames({ collectionId: state.mapped[4].id }),
        getFilteredGames({ collectionId: state.mapped[5].id }),
      ]);

      if (data) {
        const defaultProps = {
          showAllBtn: true,
          showArrows: true,
        };

        state.mapped[0] = {
          id: state.mapped[0].id,
          identity: state.mapped[0].identity,
          name: state.mapped[0].name,
          titleIcon: Object.values(mainCategories)[0],
          games: data[0].data,
          ...defaultProps,
        };

        state.mapped[1] = {
          id: state.mapped[1].id,
          identity: state.mapped[1].identity,
          name: state.mapped[1].name,
          titleIcon: Object.values(mainCategories)[1],
          games: data[1].data,
          ...defaultProps,
        };

        state.mapped[2] = {
          id: state.mapped[2].id,
          identity: state.mapped[2].identity,
          name: state.mapped[2].name,
          titleIcon: Object.values(mainCategories)[2],
          games: data[2].data,
          ...defaultProps,
        };

        state.mapped[3] = {
          id: state.mapped[3].id,
          identity: state.mapped[3].identity,
          name: state.mapped[3].name,
          titleIcon: Object.values(mainCategories)[3],
          games: data[3].data,
          ...defaultProps,
        };

        state.mapped[4] = {
          id: state.mapped[4].id,
          identity: state.mapped[4].identity,
          name: state.mapped[4].name,
          titleIcon: Object.values(mainCategories)[4],
          games: data[4].data,
          ...defaultProps,
        };

        state.mapped[5] = {
          id: state.mapped[5].id,
          identity: state.mapped[5].identity,
          name: state.mapped[5].name,
          titleIcon: Object.values(mainCategories)[5],
          games: data[5].data,
          ...defaultProps,
        };
      }
    } catch (error) {
      console.error('error', error);
    }
  });

  const selectedTabId = ref<string>('favorites');
  const topSliderProps = {
    settings: {
      itemsToShow: 1,
      pauseAutoplayOnHover: true,
      itemsToScroll: 1,
      autoplay: 3000,
      transition: 500,
      wrapAround: true,
    },
  };

  function selectTab(id: string): void {
    selectedTabId.value = id;
  }

  const changeCategory = (categoryId: string) => {
    router.push({ path: '/games', query: { category: categoryId } });
  };
</script>
