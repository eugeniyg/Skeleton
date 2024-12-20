<template>
  <div class="limits">
    <div class="limits__header">
      <h1 class="limits__heading">
        {{ getContent(limitsContent, defaultLimitsContent, 'title') }}
      </h1>

      <div class="limits__mode">
        <span class="limits__mode-label">
          {{ getContent(limitsContent, defaultLimitsContent, 'modeToggle') }}
        </span>

        <form-input-toggle v-model:value="isAdvancedModeEnabled" name="toggle" @change="toogleAdvancedMode" />
      </div>
    </div>

    <div v-show="status !== 'pending'" class="limits__grid">
      <card-deposit-limits v-if="isAdvancedModeEnabled" />
      <card-loss-limits />
      <card-bet-limits />
      <card-cooling-off-limits />
      <card-self-exclusion-limits v-if="isAdvancedModeEnabled" @open-confirm-modal="openConfirmModal" />
    </div>

    <modal-confirm-limit-update :key="confirmModalKey" :period="state.period" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileLimits } from '~/types';

  const limitsStore = useLimitsStore();
  const { getLimits, setLimitsContent, showModal, toogleAdvancedMode } = limitsStore;
  const { limitsContent, defaultLimitsContent, isAdvancedModeEnabled } = storeToRefs(limitsStore);
  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'profileLimitsContent',
    contentRoute: ['profile', 'limits'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileLimits>(contentParams);
  const { status, data: pageContent } = await useLazyAsyncData(getContentData);

  watch(
    status,
    async newValue => {
      if (newValue === 'success') {
        await nextTick();
        setLimitsContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData);
      }
    },
    { immediate: true }
  );

  const state = reactive<{
    period: undefined | string;
  }>({
    period: undefined,
  });

  const confirmModalKey = ref(0);
  const openConfirmModal = (period: string) => {
    state.period = period;
    confirmModalKey.value += 1;
    showModal('confirmLimitUpdate');
  };

  onMounted(() => {
    getLimits();
  });
</script>

<style src="~/assets/styles/pages/profile/limits.scss" lang="scss" />
