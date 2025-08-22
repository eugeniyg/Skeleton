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
  import type { ILotteryCommon } from "~/types";
  import { getContent } from "#imports";
  
  const lotteryContent = ref<Maybe<ILotteryCommon>>(inject('lotteryContent'));
  const lotteryDefaultContent = ref<Maybe<ILotteryCommon>>(inject('lotteryDefaultContent'));
  
  const label = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'howGet.label'));
  const image = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'howGet.image'));
  
  const howGetItems = computed(() => {
    if (lotteryContent.value?.howGet || lotteryDefaultContent.value?.howGet) {
      return [
        getContent(lotteryContent.value, lotteryDefaultContent.value, 'howGet.first'),
        getContent(lotteryContent.value, lotteryDefaultContent.value, 'howGet.second'),
        getContent(lotteryContent.value, lotteryDefaultContent.value, 'howGet.third'),
      ];
    }
    return [];
  });
</script>

<style src="~/assets/styles/components/lottery/steps.scss" lang="scss"/>