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

    <div class="limits__grid">
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

    <modal-deposit-limit-reached/>

    <modal-game-limit-reached/>

    <modal-confirm-limit-update
      :period="state.period"
      :key="confirmModalKey"
    />

  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IProfileLimits } from '~/types';

  const limitsStore = useLimitsStore();
  const globalStore = useGlobalStore();
  const {
    getLimits, setLimitsContent, showModal, toogleAdvancedMode,
  } = limitsStore;
  const {
    limitsContent, defaultLimitsContent, isAdvancedModeEnabled,
  } = storeToRefs(limitsStore);
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { getLocalesContentData, getContent } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProfileLimitsContent', () => queryContent(currentLocale.value?.code as string, 'profile', 'limits').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProfileLimitsContent', () => queryContent(defaultLocale.value?.code as string, 'profile', 'limits').findOne()),
    useAsyncData('updateLimits', getLimits)
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const currentLocaleLimitsContent: Maybe<IProfileLimits> = currentLocaleData;
  const defaultLocaleLimitsContent: Maybe<IProfileLimits> = defaultLocaleData;

  setLimitsContent(currentLocaleLimitsContent, defaultLocaleLimitsContent);

  interface EditPropsInterface {
    limitId: string | undefined,
    definition: number | undefined,
    amount: number | undefined,
    currency: string | undefined,
    period: string | undefined,
  }

  const state = reactive<{
    definition: number | undefined,
    editProps: EditPropsInterface,
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

  const openEditModal = (limitData: EditPropsInterface) => {
    state.editProps = limitData;
    editModalKey.value += 1;
    showModal('editLimit');
  };

  const openConfirmModal = (period: string) => {
    state.period = period;
    confirmModalKey.value += 1;
    showModal('confirmLimitUpdate');
  };
</script>

<style src="~/assets/styles/pages/profile/limits.scss" lang="scss" />
