<template>
  <div v-if="showBlock" class="group-games-participating">
    <div class="group-games-participating__header">
      <atomic-icon v-if="titleIcon" :id="titleIcon"/>
      <h2 class="group-games-participating__title">
        {{ gameCategoriesObj[props.category.identity]?.label || props.category.name || props.category.identity }}
      </h2>
      
      <div class="group-games-participating__total-rows">
        {{ totalGamesLabel }}
      </div>
    </div>
    
    <div class="group-games-participating__items">
      <template v-if="games.length">
        <card-base v-for="(game, gameIndex) in games" :key="gameIndex" :game-info="game"/>
      </template>
      
      <template v-else>
        <Skeletor v-for="n in 9" :key="n" class="card-base" as="div"/>
      </template>
    </div>
    
    <button-base class="btn-load-more" type="ghost" size="sm" @click="loadMoreGames">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.participatingMoreButton') }}
      <atomic-icon id="reset"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { ICollection, IGame, IPaginationMeta } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';
  import { Skeletor } from 'vue-skeletor';
  
  const props = defineProps<{
    category: ICollection;
  }>();
  
  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    gameCategoriesObj
  } = globalStore;
  const {
    headerCountry,
    isMobile
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const titleIcon = gameCategoriesObj[props.category.identity]?.icon;
  
  const games = ref<IGame[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const { getFilteredGames } = useCoreGamesApi();
  
  const totalGamesLabel = computed(() => {
    return getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.participatingGamesCountLabel')
      .replace('${gamesCount}', pageMeta.value?.totalRows || '');
  });
  
  const defaultRequestParams : any = {
    collectionId: props.category.id,
    perPage: isMobile.value ? 6 : 18,
    countries: headerCountry.value ? [headerCountry.value] : undefined,
    sortBy: 'default',
    sortOrder: 'asc',
  };
  
  const loadMoreGames = async (): Promise<void> => {
    if (pageMeta.value?.page === pageMeta.value?.totalPages) return;
    
    const gamesResponse = await getFilteredGames({
      ...defaultRequestParams,
      page: pageMeta.value ? pageMeta.value.page + 1 : 1,
    });
    games.value = games.value.concat(gamesResponse.data);
    pageMeta.value = gamesResponse.meta;
  };
  
  const showBlock = ref<boolean>(true);
  onMounted(async () => {
    const gamesResponse = await getFilteredGames(defaultRequestParams);
    if (!gamesResponse.data.length) return (showBlock.value = false);
    games.value = gamesResponse.data;
    pageMeta.value = gamesResponse.meta;
    await nextTick();
  });
</script>

<style src="~/assets/styles/components/group/participating.scss" lang="scss"/>
