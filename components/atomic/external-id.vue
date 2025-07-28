<template>
  <div class="external-id" :class="{ 'is-active': tooltipVisible }" @click="copyExternalId">
    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="btn-copy__tooltip">{{ messageAfterCopyText }}</div>
    </transition>
    <div class="external-id__label">{{ labelText }}</div>
    <div class="external-id__value">{{ profile?.externalId }}</div>
    <atomic-icon id="copy" class="external-id__icon" />
  </div>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';
  import type { IProfilePersonal } from '~/types';

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const showTooltip = (): void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const copyExternalId = (): void => {
    const externalId = profile.value?.externalId || '';
    copy(String(externalId));
    showTooltip();
  };

  defineExpose({
    copyExternalId,
  });

  const contentParams = {
    contentCollection: 'profile',
    contentSource: 'personal',
    isPage: false,
  };
  const { getContentData } = useContentLogic<IProfilePersonal>(contentParams);
  const { data: pageContent } = await useLazyAsyncData('profilePersonalContent', getContentData);

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const labelText = computed(() =>
    getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'externalId.label')
  );
  const messageAfterCopyText = computed(() =>
    getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'externalId.copyMsg')
  );
</script>

<style src="~/assets/styles/components/atomic/external-id.scss" lang="scss" />
