<template>
  <div class="page-providers">
    <div class="page-providers__header">
      <div class="page-providers__heading">
        {{ getContent(providersContent, defaultLocaleProvidersContent, 'title') }}
      </div>

      <div class="page-providers__count">
        {{ gameProviders?.length || 0 }} {{ getContent(providersContent, defaultLocaleProvidersContent, 'providersLabel') }}
      </div>

      <div class="page-providers__filter">
        <providers-filter
          :currentLocaleContent="providersContent"
          :defaultLocaleContent="defaultLocaleProvidersContent"
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
      :currentLocaleContent="providersContent"
      :defaultLocaleContent="defaultLocaleProvidersContent"
    />

    <atomic-empty
      v-else-if="requestParams.name && !loadingProviders"
      :title="getContent(providersContent, defaultLocaleProvidersContent, 'empty.title')"
      :subTitle="getContent(providersContent, defaultLocaleProvidersContent, 'empty.description')"
      :image="getContent(providersContent, defaultLocaleProvidersContent, 'empty.image')"
    />

    <atomic-seo-text v-if="providersContent?.seo?.text" v-bind="providersContent.seo.text"/>
  </div>
</template>

<script setup lang="ts">
  import { IProvidersPage } from "~/types";
  import { storeToRefs } from "pinia";
  import { IGameProvider, IProvidersRequest } from "@skeleton/core/types";

  const globalStore = useGlobalStore();
  const gamesStore = useGamesStore();

  const {
    currentLocale,
    defaultLocale,
    alertsData,
    defaultLocaleAlertsData
  } = storeToRefs(globalStore);

  const { showAlert } = useLayoutStore();

  const {
    setPageSeo,
    getContent,
    getLocalesContentData,
  } = useProjectMethods();

  const { gameProviders } = storeToRefs(gamesStore);

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProvidersPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'providers').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProvidersPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'providers').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);

  const providersContent: Maybe<IProvidersPage> = currentLocaleData;
  const defaultLocaleProvidersContent: Maybe<IProvidersPage> = defaultLocaleData;
  setPageSeo(providersContent?.seo);

  const staticProviderIdentity = getContent(providersContent, defaultLocaleProvidersContent, 'staticProvider.identity');
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
    providersList.value = providers.filter(provider => provider.identity !== staticProviderIdentity);
    staticProviderInfo.value = providers.find(provider => provider.identity === staticProviderIdentity);
  }
  const providersList = ref<IGameProvider[]>([]);

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