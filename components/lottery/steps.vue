<template>
  <div class="lottery-steps">
    <div class="lottery-steps__title">{{ label }}</div>
    
    <div class="lottery-steps__items">
      <div v-for="(item, index) in howGetItems" :key="index" class="lottery-steps__item">
        <span class="lottery-steps__number">{{ index + 1 }}</span>
        <p class="lottery-steps__text">{{ item }}</p>
      </div>
    </div>
    
    <atomic-picture v-if="image" class="lottery-steps__picture" :src="image"/>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import { getContent } from "#imports";
  
  const lotteryContent = ref<Maybe<ILotteryPage>>(inject('lotteryContent'));
  const defaultLocaleLotteryContent = ref<Maybe<ILotteryPage>>(inject('defaultLocaleLotteryContent'));
  
  const label = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'howGet.label'));
  const image = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'howGet.image'));
  
  const howGetItems = computed(() => {
    if (lotteryContent.value?.howGet || defaultLocaleLotteryContent.value?.howGet) {
      return [
        getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'howGet.first'),
        getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'howGet.second'),
        getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'howGet.third'),
      ];
    }
    return [];
  });

</script>

<style src="~/assets/styles/components/lottery/steps.scss" lang="scss"/>