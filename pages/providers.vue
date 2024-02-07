<template>
  <div class="page-providers">
    <div class="page-providers__header">
      <div class="page-providers__heading">
        {{ getContent(providersContent, defaultLocaleProvidersContent, 'title') }}
      </div>

      <div class="page-providers__count">
        {{ gameProviders?.length || 0 }} {{ getContent(providersContent, defaultLocaleProvidersContent, 'providersLabel') }}
      </div>

      <div v-if="providersContent || defaultLocaleProvidersContent" class="page-providers__filter">
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
  import type { IProvidersPage } from "~/types";
  import { storeToRefs } from "pinia";
  import type { IGameProvider, IProvidersRequest } from "@skeleton/core/types";

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

  const providersContent = ref<Maybe<IProvidersPage>>();
  const defaultLocaleProvidersContent = ref<Maybe<IProvidersPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<IProvidersPage>;
    defaultLocaleData: Maybe<IProvidersPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    providersContent.value = contentData?.currentLocaleData;
    defaultLocaleProvidersContent.value = contentData?.defaultLocaleData;
    setPageSeo(providersContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('providersPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'providers').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'providers').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('providersPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const staticProviderIdentity = computed(() => getContent(providersContent.value, defaultLocaleProvidersContent.value, 'staticProvider.identity'));
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