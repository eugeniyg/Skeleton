<template>
  <div class="limits">
    <div class="limits__header">
      <h1 class="limits__heading">{{ getContent(limitsContent, defaultLimitsContent, 'title') }}</h1>
      <div class="limits__mode">
        <span class="limits__mode-label">{{ getContent(limitsContent, defaultLimitsContent, 'modeToggle') }}</span>
        <form-input-toggle
          v-model:value="isAdvancedModeEnabled"
          name="toggle"
          @change="toogleAdvancedMode"
        />
      </div>
    </div>

    <div v-show="!pending" class="limits__grid">
      <card-deposit-limits
        v-if="isAdvancedModeEnabled"
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
      />

      <card-loss-limits
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
      />

      <card-bet-limits
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
      />

      <card-cooling-off-limits/>

      <card-self-exclusion-limits
        v-if="isAdvancedModeEnabled"
        @open-confirm-modal="openConfirmModal"
      />

      <modal-add-limit
        :definition="state.definition"
        :key="addModalKey"
      />

      <modal-edit-limit
        v-bind="state.editProps"
        :key="editModalKey"
      />
    </div>

    <modal-game-limit-reached/>

    <modal-confirm-limit-update
      :period="state.period"
      :key="confirmModalKey"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileLimits } from '~/types';

  const limitsStore = useLimitsStore();
  const globalStore = useGlobalStore();
  const {
    getLimits,
    setLimitsContent,
    showModal,
    toogleAdvancedMode
  } = limitsStore;
  const {
    limitsContent, defaultLimitsContent, isAdvancedModeEnabled,
  } = storeToRefs(limitsStore);
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { getLocalesContentData, getContent, setPageMeta } = useProjectMethods();

  const currentLocaleLimitsContent = ref<Maybe<IProfileLimits>>();
  const defaultLocaleLimitsContent = ref<Maybe<IProfileLimits>>();

  interface IPageContent {
    currentLocaleData: Maybe<IProfileLimits>;
    defaultLocaleData: Maybe<IProfileLimits>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    currentLocaleLimitsContent.value = contentData?.currentLocaleData;
    defaultLocaleLimitsContent.value = contentData?.defaultLocaleData;
    setLimitsContent(currentLocaleLimitsContent.value, defaultLocaleLimitsContent.value);
    setPageMeta(currentLocaleLimitsContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('profileLimitsContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'limits').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'limits').findOne(),
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('profileLimitsContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  interface IEditProps {
    limitId: string | undefined,
    definition: number | undefined,
    amount: number | undefined,
    currency: string | undefined,
    period: string | undefined,
  }

  const state = reactive<{
    definition: number | undefined,
    editProps: IEditProps,
    period: undefined | string,
  }>({
    definition: undefined,
    period: undefined,
    editProps: {
      limitId: undefined,
      definition: undefined,
      amount: undefined,
      currency: undefined,
      period: undefined,
    },
  });

  const addModalKey = ref(0);
  const editModalKey = ref(0);
  const confirmModalKey = ref(0);

  const openLimitModal = (definition: number) => {
    state.definition = definition;
    addModalKey.value += 1;
    showModal('addLimit');
  };

  const openEditModal = (limitData: IEditProps) => {
    state.editProps = limitData;
    editModalKey.value += 1;
    showModal('editLimit');
  };

  const openConfirmModal = (period: string) => {
    state.period = period;
    confirmModalKey.value += 1;
    showModal('confirmLimitUpdate');
  };

  onMounted(() => {
    getLimits();
  })
</script>

<style src="~/assets/styles/pages/profile/limits.scss" lang="scss" />
