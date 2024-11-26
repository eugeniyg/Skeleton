<template>
  <div class="game-category" style="color: white">
    <!--    <list-grid-->
    <!--      v-if="props.pageData.length"-->
    <!--      :items="props.pageData"-->
    <!--      :meta="props.pageMeta"-->
    <!--      @load-more="emit('loadMore')"-->
    <!--    />-->

    <!--    <atomic-empty-->
    <!--      v-else-if="!props.loadingGames"-->
    <!--      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"-->
    <!--      :sub-title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"-->
    <!--      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"-->
    <!--    />-->

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  // import { storeToRefs } from 'pinia';
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';
  import type { IGamesPage } from '~/types';

  // const props = defineProps<{
  //   pageData: IGame[];
  //   pageMeta: IPaginationMeta | undefined;
  //   loadingGames: boolean;
  // }>();

  const emit = defineEmits(['loadMore', 'pageMounted']);
  // const route = useRoute();
  // const { categoryIdentity } = route.params;
  // const globalStore = useGlobalStore();
  // const { headerCountry, isMobile } = storeToRefs(globalStore);
  // const { getProviderList, getCollectionsList } = useGamesStore();
  // const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'gamesPageContent',
    contentRoute: ['pages', 'games'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IGamesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  // const gameItems = ref<IGame[]>([]);
  // const pageMeta = ref<IPaginationMeta>();
  // const loadingGames = ref<boolean>(false);

  // const getCategoryId = async (): Promise<string | undefined> => {
  //   const gameCategories = await getCollectionsList();
  //   const currentCategory = gameCategories.find(category => category.identity === categoryIdentity);
  //   return currentCategory?.id;
  // };
  //
  // const getProvidersId = async (): Promise<string[]> => {
  //   console.log(props.providers);
  //   const gameProviders = await getProviderList();
  //   return gameProviders.filter(provider => props.providers.includes(provider.identity)).map(provider => provider.id);
  // };

  // const { getFilteredGames } = useCoreGamesApi();
  // const getItems = async (nextPage: boolean): Promise<void> => {
  //   if (loadingGames.value || (nextPage && pageMeta.value && pageMeta.value.page >= pageMeta.value.totalPages)) return;
  //   loadingGames.value = true;
  //
  //   const [categoryId, providerIds] = await Promise.all([getCategoryId(), getProvidersId()]);
  //   console.log(providerIds);
  //   const params: any = {
  //     page: nextPage ? (pageMeta.value?.page || 0) + 1 : 1,
  //     perPage: isMobile.value && window.innerHeight < 1000 ? 24 : 72,
  //     name: props.search || undefined,
  //     collectionId: categoryId,
  //     sortBy: props.sortBy,
  //     sortOrder: props.sortOrder,
  //     countries: headerCountry.value ? [headerCountry.value] : undefined,
  //     providerId: providerIds,
  //   };
  //
  //   try {
  //     const { data, meta } = await getFilteredGames(params);
  //     gameItems.value = nextPage ? gameItems.value.concat(data) : data;
  //     pageMeta.value = meta;
  //   } catch {
  //     gameItems.value = [];
  //     pageMeta.value = undefined;
  //   }
  //
  //   loadingGames.value = false;
  // };

  // const changedTrigger = debounce(
  //   async (): Promise<void> => {
  //     console.log('inside debounce');
  //     await getItems(false);
  //   },
  //   500,
  //   { leading: false }
  // );

  // watch([props.search, props.sortBy, props.sortOrder, props.providers], changedTrigger);

  onMounted(() => {
    emit('pageMounted');
  });
</script>
