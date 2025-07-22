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
      <card-self-exclusion-limits v-if="isAdvancedModeEnabled" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileLimits } from '~/types';

  const limitsStore = useLimitsStore();
  const { getLimits, setLimitsContent, toogleAdvancedMode } = limitsStore;
  const { limitsContent, defaultLimitsContent, isAdvancedModeEnabled } = storeToRefs(limitsStore);

  const contentParams = {
    contentCollection: 'profile',
    contentSource: 'limits',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileLimits>(contentParams);
  const { status, data: pageContent } = await useLazyAsyncData('profileLimitsContent', getContentData);

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

  onMounted(() => {
    getLimits();
  });
</script>

<style src="~/assets/styles/pages/profile/limits.scss" lang="scss" />
