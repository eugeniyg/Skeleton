<template>
  <div class="tournaments">
    <div class="tournaments__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>

    <div class="tournaments__description">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'description') }}
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="state.globalLoading" class="tournaments__spinner">
        <div class="tournaments__spinner-border">
          <div class="tournaments__spinner-core" />
        </div>
      </div>

      <div v-else>
        <div v-if="state.activeTournaments.length" class="tournaments__grid">
          <tournament-card
            v-for="tournament in state.activeTournaments"
            :key="`${tournament.id}-${tournament.state}`"
            :tournamentData="tournament"
            :currentLocaleCommonContent="commonContent?.currentLocaleData"
            :defaultLocaleCommonContent="commonContent?.defaultLocaleData"
            :tournamentContent="state.tournamentsContent[tournament.identity]"
            @tournamentStarted="getActiveTournaments"
            @tournamentFinished="getTournamentsData"
          />
        </div>

        <template v-if="state.finishedTournaments.length">
          <div ref="finishedElement" class="tournaments__finished-title">
            {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'finishedLabel') }}
          </div>

          <div class="tournaments__grid">
            <tournament-card
              v-for="tournament in state.finishedTournaments"
              :key="tournament.id"
              :tournamentData="tournament"
              :currentLocaleCommonContent="commonContent?.currentLocaleData"
              :defaultLocaleCommonContent="commonContent?.defaultLocaleData"
              :tournamentContent="state.tournamentsContent[tournament.identity]"
              isFinished
            />
          </div>

          <atomic-pagination
            v-if="state.finishedTournamentsMeta?.totalPages && state.finishedTournamentsMeta.totalPages > 1"
            v-bind="state.finishedTournamentsMeta"
            @select-page="changeFinishedPage"
          />
        </template>

        <atomic-empty
          v-if="!state.activeTournaments.length && !state.finishedTournaments.length && !state.globalLoading"
          variant="search"
          :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
          :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
          :subTitle="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
        />
      </div>
    </transition>

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
  import type { ITournamentCommon, ITournamentPage, ITournamentsPage } from '~/types';
  import type { IPaginationMeta, ITournament } from '@skeleton/api/types';
  import { getTournaments } from '@skeleton/api/retention';
  import type { Collections, CollectionItemBase } from '@nuxt/content';
  import { getContent } from '#imports';
  type CollectionKey = keyof Collections;

  const globalStore = useGlobalStore();
  const { currentLocale, isMobile } = storeToRefs(globalStore);

  const contentParams = {
    contentCollection: 'pages',
    contentSource: 'tournaments',
    isPage: true,
  };
  const tournamentCommonParams = {
    contentCollection: 'pages',
    contentSource: 'tournament',
  };
  const { getContentData } = useContentLogic<ITournamentsPage>(contentParams);
  const { getContentData: getTournamentsCommonData } = useContentLogic<ITournamentCommon>(tournamentCommonParams);
  const { data: content } = await useLazyAsyncData('tournamentsContent', () => {
    return Promise.all([getContentData(), getTournamentsCommonData()]);
  });

  const pageContent = computed<
    | {
        currentLocaleData: Maybe<ITournamentsPage>;
        defaultLocaleData: Maybe<ITournamentsPage>;
      }
    | undefined
  >(() => content.value?.[0]);

  const commonContent = computed<
    | {
        currentLocaleData: Maybe<ITournamentCommon>;
        defaultLocaleData: Maybe<ITournamentCommon>;
      }
    | undefined
  >(() => content.value?.[1]);

  interface IState {
    globalLoading: boolean;
    activeLoading: boolean;
    finishedLoading: boolean;
    activeTournaments: ITournament[];
    finishedTournaments: ITournament[];
    finishedTournamentsMeta: IPaginationMeta | undefined;
    tournamentsContent: { [key: string]: ITournamentPage };
    tournamentIdentities: string[];
  }

  const state = reactive<IState>({
    globalLoading: true,
    activeLoading: false,
    finishedLoading: false,
    activeTournaments: [],
    finishedTournaments: [],
    finishedTournamentsMeta: undefined,
    tournamentsContent: {},
    tournamentIdentities: [],
  });

  const getFinishedTournaments = async (page = 1): Promise<void> => {
    if (state.finishedLoading) return;
    state.finishedLoading = true;

    try {
      const { data, meta } = await getTournaments({
        page,
        perPage: isMobile.value ? 3 : 6,
        state: [4, 5],
        identity: state.tournamentIdentities,
      });
      state.finishedTournaments = data;
      state.finishedTournamentsMeta = meta;
    } catch {
      state.finishedTournaments = [];
      state.finishedTournamentsMeta = undefined;
    }

    state.finishedLoading = false;
  };

  const getActiveTournaments = async (): Promise<void> => {
    if (state.activeLoading) return;
    state.activeLoading = true;

    try {
      const { data } = await getTournaments({ state: [2, 3], identity: state.tournamentIdentities });
      state.activeTournaments = data;
    } catch {
      state.activeTournaments = [];
    }

    state.activeLoading = false;
  };

  const completeTournamentsObject = (tournamentPages: CollectionItemBase[]): { [key: string]: ITournamentPage } => {
    const tournamentsObject: { [key: string]: ITournamentPage } = {};
    tournamentPages.forEach(tournamentPage => {
      const contentBody = tournamentPage.meta.body as ITournamentPage;
      tournamentsObject[contentBody.pageIdentity] = contentBody;
    });
    return tournamentsObject;
  };

  const getTournamentsData = async (): Promise<void> => {
    const contentPagesResponse = await queryCollection(
      `${currentLocale.value?.code}Tournaments` as CollectionKey
    ).all();

    if (contentPagesResponse?.length) {
      state.tournamentsContent = completeTournamentsObject(contentPagesResponse);
      state.tournamentIdentities = contentPagesResponse.map(item => (item.meta.body as ITournamentPage).pageIdentity);
      await Promise.all([getActiveTournaments(), getFinishedTournaments()]);
    }
    state.globalLoading = false;
  };

  const finishedElement = ref();
  const changeFinishedPage = async (page: number): Promise<void> => {
    const offsetTop = finishedElement.value.offsetTop;
    await getFinishedTournaments(page);
    window.scrollTo({ top: offsetTop - 20, behavior: 'smooth' });
  };

  onMounted(async () => {
    await getTournamentsData();
  });
</script>

<style src="~/assets/styles/pages/tournaments/index.scss" lang="scss" />
