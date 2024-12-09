<template>
  <div class="tournament">
    <template v-if="pageData?.tournamentGeneralData">
      <tournament-banner
        :tournamentData="pageData?.tournamentGeneralData"
        :tournamentContent="pageData?.pageContent"
        :currentLocaleCommonContent="pageData?.currentLocaleCommonContent"
        :defaultLocaleCommonContent="pageData?.defaultLocaleCommonContent"
      />
    </template>

    <not-found v-else-if="['success', 'error'].includes(pageDataStatus)" />
    <div class="tournament__container">
      <!--        <tournament-info-->
      <!--          v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'info')"-->
      <!--          :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'info')"-->
      <!--        />-->

      <!--        <tournament-results-->
      <!--          v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'results')"-->
      <!--          :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'results')"-->
      <!--        />-->

      <!--        <tournament-participate-->
      <!--          v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'participate')"-->
      <!--          :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'participate')"-->
      <!--        />-->

      <!--        <group-participating-->
      <!--          v-if="recommendedCategory"-->
      <!--          :category="recommendedCategory"-->
      <!--        />-->

      <tournament-terms
        :title="getContent(pageData?.currentLocaleCommonContent, pageData?.defaultLocaleCommonContent, 'termsLabel')"
        :content="pageData?.pageContent?.termsText"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentCommon, ITournamentPage } from '~/types';
  import type { ITournamentDefinite, ITournamentGeneral } from '@skeleton/core/types/tournamentsTypes';

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { getContent } = useProjectMethods();
  const route = useRoute();
  const routeIdentity = route.params.identity as string;
  const routeFinished = route.query.finished as string;

  const { getTournaments, getTournament } = useCoreTournamentsApi();
  const getTournamentGeneralData = async (): Promise<ITournamentGeneral> => {
    const { data: tournamentsList } = await getTournaments({
      identity: [routeIdentity],
      state: routeFinished ? [4, 5] : [2, 3],
    });
    if (!tournamentsList?.length) return Promise.reject('Tournament Not Found!');
    return tournamentsList[0];
  };

  const pageContentParams = {
    contentKey: `tournamentPage-${routeIdentity}`,
    contentRoute: ['tournaments'],
    where: { identity: routeIdentity },
    currentOnly: true,
    isPage: true,
  };
  const tournamentCommonParams = {
    contentKey: 'tournamentsCommonContent',
    contentRoute: ['pages', 'tournament'],
  };
  const { getContentData } = useContentLogic<ITournamentPage>(pageContentParams);
  const { getContentData: getTournamentsCommonData } = useContentLogic<ITournamentCommon>(tournamentCommonParams);

  const nuxtApp = useNuxtApp();
  if (!import.meta.server && !nuxtApp.isHydrating) clearNuxtData(`tournamentData-${routeIdentity}`);
  const { data: pageData, status: pageDataStatus } = await useLazyAsyncData(
    `tournamentData-${routeIdentity}`,
    async () => {
      const [pageContentResponse, tournamentCommonResponse, generalDataResponse] = await Promise.all([
        getContentData(),
        getTournamentsCommonData(),
        getTournamentGeneralData(),
      ]);
      if (!pageContentResponse?.currentLocaleData || !generalDataResponse) return undefined;
      return {
        pageContent: pageContentResponse.currentLocaleData,
        currentLocaleCommonContent: tournamentCommonResponse?.currentLocaleData,
        defaultLocaleCommonContent: tournamentCommonResponse?.defaultLocaleData,
        tournamentGeneralData: generalDataResponse,
      };
    }
  );
</script>

<style src="~/assets/styles/pages/tournaments/identity.scss" lang="scss" />
