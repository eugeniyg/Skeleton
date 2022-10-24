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
      <favorite-recently v-if="isLoggedIn" />
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

    <group-winners showArrows />

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

    <group-promotions v-if="globalComponentsContent?.promotions" v-bind="globalComponentsContent.promotions" />

    <!-- <cards-group v-bind="fakeStore.newRelisesCards">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group> -->

    <atomic-seo-text v-if="mainContent?.seo?.text" v-bind="mainContent.seo.text" />
  </div>
</template>

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css';
  import {
    Carousel, Slide, Pagination, Navigation,
  } from 'vue3-carousel';
  import { storeToRefs } from 'pinia';
  import { CardsGroupInterface, MainContentInterface, SlideInterface } from '~/types';
  import FavoriteRecently from '~/components/favorite-recently.vue';

  const globalStore = useGlobalStore();
  const { currentLocale, globalComponentsContent } = storeToRefs(globalStore);
  const sliderResponse = await useAsyncData('sliderData', () => queryContent(`main-slider/${currentLocale.value.code}`).findOne());
  const mainContentResponse = await useAsyncData('mainContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['mainPage']).findOne());
  const mainContent:MainContentInterface|undefined = mainContentResponse.data.value?.mainPage;
  const sliderItems:SlideInterface[]|undefined = sliderResponse.data.value?.slider;
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent.value?.cardsGroup;

  const fakeStore = useFakeStore();
  const router = useRouter();
  const gameStore = useGamesStore();
  const { gameCollections } = storeToRefs(gameStore);
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const providerCards = fakeStore.providerCards();

  const mainCategories = ['hot', 'slots', 'turbogames', 'new', 'table', 'live'];
  const sortCategory = gameCollections.value.filter((item) => mainCategories.find((el) => el === item.identity))
    .sort((a, b) => mainCategories.map((e) => e).indexOf(a.identity) - mainCategories.map((e) => e).indexOf(b.identity));

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

  const {
    preloaderDone, preloaderStart, localizePath, setPageSeo,
  } = useProjectMethods();
  setPageSeo(mainContent?.seo);
  onBeforeMount(() => {
    preloaderStart();
  });

  const gamesGroupLoaded = ref<number>(0);
  watch(() => gamesGroupLoaded.value, (newValue:number) => {
    if (newValue === mainCategories.length) {
      preloaderDone();
    }
  });

  const changeCategory = (categoryId: string) => {
    router.push({ path: localizePath('/games'), query: { category: categoryId } });
  };
</script>
