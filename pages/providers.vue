<template>
  <div class="page-providers">
    <div class="page-providers__header">
      <div class="page-providers__heading">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
      </div>

      <div class="page-providers__count">
        {{ providersGeneralCount }}
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'providersLabel') }}
      </div>

      <div v-if="pageContent?.currentLocaleData || pageContent?.defaultLocaleData" class="page-providers__filter">
        <providers-filter
          :current-locale-content="pageContent?.currentLocaleData"
          :default-locale-content="pageContent?.defaultLocaleData"
          :filters="requestParams"
          @on-search="onSearch"
          @change-sort="onSort"
        />
      </div>
    </div>

    <list-providers
      v-if="providersList.length || staticProviderInfo"
      :providers-list="providersList"
      :static-provider="staticProviderInfo"
      :current-locale-content="pageContent?.currentLocaleData"
      :default-locale-content="pageContent?.defaultLocaleData"
    />

    <atomic-empty
      v-else-if="requestParams.name && !loadingProviders"
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :sub-title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
    />

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProvidersPage } from '~/types';
  import type { IGameProvider, IProvidersRequest } from '@skeleton/api/types';
  import { getGameProviders } from '@skeleton/api/games';

  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { showAlert } = useLayoutStore();

  const contentParams = {
    contentKey: 'providersPageContent',
    contentCollection: 'pages',
    contentSource: 'providers',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProvidersPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const providersList = ref<IGameProvider[]>([]);

  const providersGeneralCount = computed(() => {
    return providersList.value.length + (staticProviderInfo.value ? 1 : 0);
  });

  const staticProviderIdentity = computed(() =>
    getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'staticProvider.identity')
  );
  const staticProviderInfo = ref<IGameProvider | undefined>();

  const requestParams = reactive<IProvidersRequest>({
    name: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  });

  const route = useRoute();
  if (Object.keys(route.query).length) {
    Object.keys(route.query).forEach(param => {
      if (requestParams.hasOwnProperty(param)) {
        requestParams[param] = route.query[param];
      }
    });
  }

  const filterProviders = (providers: IGameProvider[]): void => {
    providersList.value = providers.filter(
      provider => !!provider.gameEnabledCount && provider.identity !== staticProviderIdentity.value
    );
    staticProviderInfo.value = providers.find(
      provider => provider.identity === staticProviderIdentity.value && !!provider.gameEnabledCount
    );
  };

  const loadingProviders = ref<boolean>(true);
  const getProviders = async (): Promise<void> => {
    try {
      const responseProviders = await getGameProviders(requestParams);
      filterProviders(responseProviders);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
  };

  const router = useRouter();
  const updateQuery = (): void => {
    router.replace({ query: requestParams });
  };

  const onSearch = async (inputValue: string | undefined): Promise<void> => {
    requestParams.name = inputValue;

    await getProviders();
    updateQuery();
  };

  const onSort = async ({ sortBy, sortOrder }: { sortBy: string; sortOrder: string }): Promise<void> => {
    requestParams.sortBy = sortBy;
    requestParams.sortOrder = sortOrder;

    await getProviders();
    updateQuery();
  };

  onMounted(async () => {
    await getProviders();
    loadingProviders.value = false;
  });
</script>

<style src="~/assets/styles/pages/providers.scss" lang="scss" />
