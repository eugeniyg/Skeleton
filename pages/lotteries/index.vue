<template>
  <div class="lotteries">
    <lotteries-banner/>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteriesPage } from "~/types";
  
  const contentParams = {
    contentCollection: 'pages',
    contentSource: 'lotteries',
    isPage: true,
  };
  const { getContentData } = useContentLogic<ILotteriesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);
  
  provide('lotteriesContent', currentLocaleContent);
  provide('defaultLocaleLotteriesContent', defaultLocaleContent);
</script>