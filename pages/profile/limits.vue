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
  import { ProfileLimitsContentInterface } from '@skeleton/types';

  const limitsStore = useLimitsStore();
  const globalStore = useGlobalStore();
  const {
    getLimits, setLimitsContent, showModal, toogleAdvancedMode,
  } = limitsStore;
  const {
    limitsContent, defaultLimitsContent, isAdvancedModeEnabled,
  } = storeToRefs(limitsStore);
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { findLocalesContentData, getContent } = useProjectMethods();

  const [limitsContentRequest] = await Promise.all([
    useAsyncData('limitsContent', () => queryContent('profile')
      .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'limits']).find()),
    useAsyncData('updateLimits', getLimits),
  ]);

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(limitsContentRequest.data.value);
  const currenctLocaleLimitsContent: Maybe<ProfileLimitsContentInterface> = currentLocaleData?.limits;
  const defaultLocaleLimitsContent: Maybe<ProfileLimitsContentInterface> = defaultLocaleData?.limits;

  setLimitsContent(currenctLocaleLimitsContent, defaultLocaleLimitsContent);

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
