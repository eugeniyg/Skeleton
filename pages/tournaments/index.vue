<template>
  <div class="tournaments">
    <div class="tournaments__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>

    <div class="tournaments__description">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'description') }}
    </div>

    <div v-if="activeTournaments.length" class="tournaments__grid">
      active cards
      <!--      <tournament-card-active v-for="(card, index) in cards?.slice(0, 2)" :key="index" v-bind="card" />-->
    </div>

    <template v-if="finishedTournaments.length">
      <div class="tournaments__finished-title">Finished</div>

      <div class="tournaments__grid">
        finished cards
        <!--        <tournament-card-finished v-for="(card, index) in cards?.slice(0, 2)" :key="index" v-bind="card" />-->
      </div>
    </template>

    <atomic-empty
      v-if="!activeTournaments.length && !finishedTournaments.length && !loadingTournaments"
      variant="search"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :subTitle="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
    />

    <template v-if="pageContent?.currentLocaleData?.howTake?.showBlock">
      <atomic-divider />

      <tournament-how-take
        :currentLocaleData="pageContent?.currentLocaleData?.howTake"
        :defaultLocaleData="pageContent?.defaultLocaleData?.howTake"
      />
    </template>

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentsPage } from '~/types';

  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'tournamentsPageContent',
    contentRoute: ['pages', 'tournaments'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ITournamentsPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const loadingTournaments = ref(false);
  const activeTournaments = [];
  const finishedTournaments = [];
  // const cards = computed(() => {
  //   return getContent(pageContent?.value?.currentLocaleData, pageContent?.value?.defaultLocaleData, 'cards');
  // });
</script>

<style src="~/assets/styles/pages/tournaments.scss" lang="scss" />
