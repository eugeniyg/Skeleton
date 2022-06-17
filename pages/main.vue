<template>
  <div>
    <client-only>
      <carousel v-bind="topSliderProps">
        <slide v-for="(props, index) in fakeStore.sliders.main" :key="index">
          <card-promo v-bind="props" />
        </slide>

        <template v-slot:addons>
          <navigation/>
          <pagination/>
        </template>
      </carousel>
    </client-only>

    <nav-cat @clickCategory="changeCategory" />

    <!--<tab-component @select-tab="selectTab" :selected="selectedTabId">
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
    </tab-component>-->

    <cards-group v-bind="fakeStore.hotCards">
      <template v-slot:card="item">
        <card-base v-bind="item"/>
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.turboCards">
      <template v-slot:card="item">
        <card-base v-bind="item"/>
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.providersCards">
      <template v-slot:card="item">
        <card-providers v-bind="item"/>
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.newRelisesCards">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.latestWinnersCards">
      <template v-slot:card="item">
        <card-latest-winners v-bind="item"/>
      </template>
    </cards-group>

    <cards-group v-bind="fakeStore.promotionsCards">
      <template v-slot:card="item">
        <card-promotions v-bind="item"/>
      </template>
    </cards-group>
  </div>
</template>

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css';
  import {
    Carousel, Slide, Pagination, Navigation,
  } from 'vue3-carousel';

  const fakeStore = useFakeStore();
  const router = useRouter();

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

  function selectTab(id:string):void {
    selectedTabId.value = id;
  }

  const changeCategory = (categoryId: string) => {
    router.push({ path: '/games', query: { category: categoryId } });
  };

</script>
