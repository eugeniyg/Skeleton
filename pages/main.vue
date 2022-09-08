<template>
  <div>
    <client-only>
      <carousel v-if="sliderItems?.length" v-bind="topSliderProps">
        <slide v-for="(slide, index) in sliderItems" :key="index">
          <card-promo v-if="slide.slideStatus === 'Published'" v-bind="slide" />
        </slide>

        <template v-slot:addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </client-only>

    <nav-cat @clickCategory="changeCategory" />

    <client-only>
      <tab-component v-if="isLoggedIn && favoriteGames.length" @select-tab="selectTab" :selected="selectedTabId">
        <tab-item :is-active="selectedTabId === 'favorites'">
          <group-favorites/>
        </tab-item>

        <!--      <tab-item :is-active="selectedTabId === 'recently-played'">-->
        <!--        <cards-group v-bind="fakeStore.recentlyCards">-->
        <!--          <template v-slot:card="item">-->
        <!--            <card-simple v-bind="item" :variant="fakeStore.recentlyCards.variant"/>-->
        <!--          </template>-->
        <!--        </cards-group>-->
        <!--      </tab-item>-->
      </tab-component>
    </client-only>

    <br />

    <group-games
      showAllBtn
      showArrows
      :category="sortCategory[0]"
      @initialLoad="gamesGroupLoaded++"
    />

    <group-games
      showAllBtn
      showArrows
      :category="sortCategory[1]"
      @initialLoad="gamesGroupLoaded++"
    />

    <cards-group
      v-if="providerCards.games?.length"
      v-bind="providerCards"
      :identity="groupContent?.providers.label"
      :titleIcon="groupContent?.providers.icon"
    >
      <template v-slot:card="item">
        <card-providers v-bind="item" />
      </template>
    </cards-group>

    <group-games
      showAllBtn
      showArrows
      :category="sortCategory[2]"
      @initialLoad="gamesGroupLoaded++"
    />

    <group-games
      showAllBtn
      showArrows
      :category="sortCategory[3]"
      @initialLoad="gamesGroupLoaded++"
    />

    <cards-group
      v-if="latestWinnersCards"
      v-bind="latestWinnersCards"
      :identity="groupContent?.latestWinners.label"
      :titleIcon="groupContent?.latestWinners.icon"
    >
      <template v-slot:card="item">
        <card-latest-winners v-bind="item" />
      </template>
    </cards-group>

    <group-games
      showAllBtn
      showArrows
      :category="sortCategory[4]"
      @initialLoad="gamesGroupLoaded++"
    />

    <group-games
      showAllBtn
      showArrows
      :category="sortCategory[5]"
      @initialLoad="gamesGroupLoaded++"
    />

    <card-promotions v-if="globalComponentsContent?.promotions" v-bind="globalComponentsContent.promotions" />

    <!-- <cards-group v-bind="fakeStore.newRelisesCards">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group> -->
  </div>
</template>

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css';
  import {
    Carousel, Slide, Pagination, Navigation,
  } from 'vue3-carousel';
  import { storeToRefs } from 'pinia';
  import { CardsGroupInterface, SlideInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale, globalComponentsContent } = storeToRefs(globalStore);
  const sliderResponse = await useAsyncData('sliderData', () => queryContent(`main-slider/${currentLocale.value.code}`).findOne());
  const sliderItems:SlideInterface[]|undefined = sliderResponse.data.value?.slider;
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent.value?.cardsGroup;

  const fakeStore = useFakeStore();
  const router = useRouter();
  const gameStore = useGamesStore();
  const { gameCollections, favoriteGames } = storeToRefs(gameStore);
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const providerCards = fakeStore.providerCards();
  const latestWinnersCards = fakeStore.latestWinnersCards();

  const mainCategories = ['hot', 'slots', 'turbogames', 'new', 'table', 'live'];
  const sortCategory = gameCollections.value.filter((item) => mainCategories.find((el) => el === item.identity))
    .sort((a, b) => mainCategories.map((e) => e).indexOf(a.identity) - mainCategories.map((e) => e).indexOf(b.identity));

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

  const { preloaderDone, preloaderStart, localizePath } = useProjectMethods();
  onBeforeMount(() => {
    preloaderStart();
  });

  const gamesGroupLoaded = ref<number>(0);
  watch(() => gamesGroupLoaded.value, (newValue:number) => {
    if (newValue === mainCategories.length) {
      preloaderDone();
    }
  });

  function selectTab(id: string): void {
    selectedTabId.value = id;
  }

  const changeCategory = (categoryId: string) => {
    router.push({ path: localizePath('/games'), query: { category: categoryId } });
  };
</script>
