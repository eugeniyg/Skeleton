<template>
  <div class="copy-transaction-id" :class="{ 'is-active': tooltipVisible }" @click="mobileClick">
    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="copy-transaction-id__tooltip">{{ messageAfterCopyText }}</div>
    </transition>
    <div class="copy-transaction-id__value">{{ formattedValue }}</div>

    <button class="copy-transaction-id__btn" @click.prevent="copyValue">
      <atomic-icon id="copy" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';
  import type { ITransactionsHistory } from '~/types';

  const props = defineProps<{
    value: string;
  }>();

  const pageContentParams = {
    contentKey: 'profileTransactionsContent',
    contentRoute: ['history', 'transactions'],
    isPage: false,
  };
  const { getContentData: getPageContent } = useContentLogic<ITransactionsHistory>(pageContentParams);
  const { data: pageContent } = await useLazyAsyncData(getPageContent);
  
  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const formattedValue = computed(() => {
    const visibleChars = 5;
    const firstPart = props.value.slice(0, visibleChars);
    const lastPart = props.value.slice(-visibleChars);
    return `${firstPart}. . .${lastPart}`;
  });

  const showTooltip = (): void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const copyValue = (): void => {
    copy(props.value || '');
    showTooltip();
  };

  const mobileClick = (): void => {
    if (isMobile.value) {
      copyValue();
    }
  };

  const messageAfterCopyText = computed(() =>
    getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'copyIdTooltip')
  );
</script>

<style src="~/assets/styles/components/copy-transaction-id.scss" lang="scss" />
