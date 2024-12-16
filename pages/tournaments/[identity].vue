<template>
  <div class="tournament">
    <template v-if="tournamentData">
      <tournament-banner
        :tournamentData="tournamentData"
        :tournamentContent="pageData?.pageContent"
        :currentLocaleCommonContent="pageData?.currentLocaleCommonContent"
        :defaultLocaleCommonContent="pageData?.defaultLocaleCommonContent"
        :gamesCount="tournamentGamesState.gamesMeta?.totalRows"
        @statusChanged="getTournamentDefiniteData"
        @goToGames="scrollToGames"
      />

      <div class="tournament__container">
        <tournament-info
          :gamesMeta="tournamentGamesState.gamesMeta"
          :currentLocaleCommonContent="pageData?.currentLocaleCommonContent"
          :defaultLocaleCommonContent="pageData?.defaultLocaleCommonContent"
          :tournamentContent="pageData?.pageContent"
          :tournamentDefiniteData="tournamentDefiniteData"
        />

        <tournament-results
          :currentLocaleCommonContent="pageData?.currentLocaleCommonContent"
          :defaultLocaleCommonContent="pageData?.defaultLocaleCommonContent"
          :tournamentDefiniteData="tournamentDefiniteData"
        />

        <transition name="fade" mode="out-in">
          <tournament-advertising
            v-if="pageData?.pageContent?.advertising?.showBlock"
            :content="pageData?.pageContent?.advertising"
          />
        </transition>

        <tournament-games
          v-if="tournamentGamesState.gamesMeta?.totalRows"
          ref="tournamentGamesComponent"
          :gamesData="tournamentGamesState.gamesData"
          :gamesMeta="tournamentGamesState.gamesMeta"
          :currentLocaleCommonContent="pageData?.currentLocaleCommonContent"
          :defaultLocaleCommonContent="pageData?.defaultLocaleCommonContent"
          :gamesLoading="tournamentGamesState.gamesLoading"
          @getMoreGames="getTournamentGames"
        />

        <tournament-terms
          :title="getContent(pageData?.currentLocaleCommonContent, pageData?.defaultLocaleCommonContent, 'termsLabel')"
          :content="pageData?.pageContent?.termsText"
        />
      </div>
    </template>

    <not-found v-else-if="['success', 'error'].includes(pageDataStatus)" />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentCommon, ITournamentPage } from '~/types';
  import type { ITournament } from '@skeleton/core/types/tournamentsTypes';
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { getContent } = useProjectMethods();
  const { getCollectionsList } = useGamesStore();
  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const route = useRoute();
  const routeIdentity = route.params.identity as string;
  const routeFinished = route.query.finished as string;

  const { getTournaments, getTournament } = useCoreTournamentsApi();
  const getTournamentGeneralData = async (): Promise<ITournament> => {
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

  const tournamentDefiniteData = ref<ITournament | undefined>();
  const tournamentData = computed(() => tournamentDefiniteData.value || pageData.value?.tournamentGeneralData);
  const requestCollections = ref<string[]>([]);
  const setCollections = async (tournamentCollections: string[], collectionsExcluded: boolean): Promise<void> => {
    const gameCollections = await getCollectionsList();
    requestCollections.value = gameCollections
      .filter(collection => {
        if (collectionsExcluded) return !tournamentCollections.includes(collection.identity);
        else return tournamentCollections.includes(collection.identity);
      })
      .map(collection => collection.id);
  };

  interface ITournamentGamesState {
    gamesLoading: boolean;
    gamesData: IGame[];
    gamesMeta: IPaginationMeta | undefined;
  }
  const tournamentGamesState = reactive<ITournamentGamesState>({
    gamesLoading: false,
    gamesData: [],
    gamesMeta: undefined,
  });
  const { getFilteredGames } = useCoreGamesApi();
  const getTournamentGames = async (page = 1): Promise<void> => {
    const nonExistentCollections =
      tournamentData.value?.conditions?.gameCollectionsExcluded === false &&
      tournamentData.value?.conditions?.gameCollections?.length &&
      !requestCollections.value.length;
    if (tournamentGamesState.gamesLoading || !tournamentData.value || nonExistentCollections) return;
    tournamentGamesState.gamesLoading = true;

    try {
      const { data, meta } = await getFilteredGames({
        page,
        perPage: isMobile.value ? 9 : 18,
        collectionId: requestCollections.value,
      });
      tournamentGamesState.gamesData = page === 1 ? data : tournamentGamesState.gamesData.concat(data);
      tournamentGamesState.gamesMeta = meta;
    } catch {
      console.error('Get games failed!');
    }
    tournamentGamesState.gamesLoading = false;
  };

  const getTournamentDefiniteData = async (): Promise<void> => {
    if (!tournamentData.value) return;
    try {
      tournamentDefiniteData.value = await getTournament({
        tournamentId: tournamentData.value.id,
        authorized: isLoggedIn.value,
      });
    } catch {
      tournamentDefiniteData.value = undefined;
    }
  };

  const getInitialData = async (): Promise<void> => {
    if (!tournamentData.value) return;

    await setCollections(
      tournamentData.value.conditions?.gameCollections || [],
      tournamentData.value.conditions?.gameCollectionsExcluded || false
    );
    getTournamentGames();
    getTournamentDefiniteData();
  };

  const componentMounted = ref(false);
  watch(pageData, () => {
    if (componentMounted.value) getInitialData();
  });

  watch(isLoggedIn, () => {
    getTournamentDefiniteData();
  });

  const tournamentGamesComponent = ref();
  const scrollToGames = () => {
    if (!tournamentGamesComponent.value) return;
    const topOffset = tournamentGamesComponent.value.$el.offsetTop;
    window.scrollTo({ top: topOffset - 20, behavior: 'smooth' });
  };

  onMounted(() => {
    componentMounted.value = true;
    if (pageDataStatus.value === 'success' && tournamentData.value) getInitialData();
  });
</script>

<style src="~/assets/styles/pages/tournaments/identity.scss" lang="scss" />
