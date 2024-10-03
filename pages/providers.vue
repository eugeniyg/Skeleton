<template>
  <div class="page-providers">
    <div class="page-providers__header">
      <div class="page-providers__heading">
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}
      </div>

      <div class="page-providers__count">
        {{ providersGeneralCount }} {{ getContent(currentLocaleContent, defaultLocaleContent, 'providersLabel') }}
      </div>

      <div v-if="currentLocaleContent || defaultLocaleContent" class="page-providers__filter">
        <providers-filter
          :currentLocaleContent="currentLocaleContent"
          :defaultLocaleContent="defaultLocaleContent"
          :filters="requestParams"
          @onSearch="onSearch"
          @changeSort="onSort"
        />
      </div>
    </div>

    <list-providers
      v-if="providersList.length || staticProviderInfo"
      :providersList="providersList"
      :staticProvider="staticProviderInfo"
      :currentLocaleContent="currentLocaleContent"
      :defaultLocaleContent="defaultLocaleContent"
    />

    <atomic-empty
      v-else-if="requestParams.name && !loadingProviders"
      :title="getContent(currentLocaleContent, defaultLocaleContent, 'empty.title')"
      :subTitle="getContent(currentLocaleContent, defaultLocaleContent, 'empty.description')"
      :image="getContent(currentLocaleContent, defaultLocaleContent, 'empty.image')"
    />

    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent.pageMeta.seoText"/>
  </div>
</template>

<script setup lang="ts">
  import type { IProvidersPage } from "~/types";
  import { storeToRefs } from "pinia";
  import type { IGameProvider, IProvidersRequest } from "@skeleton/core/types";

  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { showAlert } = useLayoutStore();
  const { getContent } = useProjectMethods();

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IProvidersPage>({
    contentKey: 'providersPageContent',
    contentRoute: ['pages', 'providers'],
    isPage: true
  });

  const providersList = ref<IGameProvider[]>([]);

  const providersGeneralCount = computed(() => {
    return providersList.value.length + (staticProviderInfo.value ? 1 : 0);
  })

  const staticProviderIdentity = computed(() => getContent(currentLocaleContent.value, defaultLocaleContent.value, 'staticProvider.identity'));
  const staticProviderInfo = ref<IGameProvider|undefined>();

  const requestParams = reactive<IProvidersRequest>({
    name: undefined,
    sortBy: undefined,
    sortOrder: undefined
  });

  const route = useRoute();
  if (Object.keys(route.query).length) {
    Object.keys(route.query).forEach((param) => {
      if (requestParams.hasOwnProperty(param)) {
        requestParams[param] = route.query[param];
      }
    })
  }

  const filterProviders = (providers: IGameProvider[]): void => {
    providersList.value = providers.filter(provider => !!provider.gameEnabledCount && provider.identity !== staticProviderIdentity.value);
    staticProviderInfo.value = providers.find(provider => provider.identity === staticProviderIdentity.value && !!provider.gameEnabledCount);
  }

  const { getGameProviders } = useCoreGamesApi();
  const loadingProviders = ref<boolean>(true);
  const getProviders = async (): Promise<void> => {
    try {
      const responseProviders = await getGameProviders(requestParams);
      filterProviders(responseProviders);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
  }

  const router = useRouter();
  const updateQuery = (): void => {
    router.replace({ query: requestParams });
  }

  const onSearch = async (inputValue: string|undefined): Promise<void> => {
    requestParams.name = inputValue;

    await getProviders();
    updateQuery();
  }

  const onSort = async ({ sortBy, sortOrder}: { sortBy: string, sortOrder: string }): Promise<void> => {
    requestParams.sortBy = sortBy;
    requestParams.sortOrder = sortOrder;

    await getProviders();
    updateQuery();
  }

  onMounted(async () => {
    await getProviders();
    loadingProviders.value = false;
  })
</script>

<style src="~/assets/styles/pages/providers.scss" lang="scss" />