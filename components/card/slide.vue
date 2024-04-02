<template>
  <div class="card-slide" :style="backgroundGradientStyle">
    <picture class="card-slide__picture card-slide__picture">
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.slideData.mobileImage)" />
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.slideData.desktopImage)" />
      <atomic-image class="card-slide__img card-slide__img" :src="props.slideData.mobileImage" />
    </picture>

    <div class="card-slide__info">
      <div class="card-slide__title">{{ props.slideData.title }}</div>
      <div class="card-slide__content" v-if="props.slideData.content" v-html="marked.parse(props.slideData.content)" />
      
      <div class="card-slide__actions" v-if="showButton">
        <button-base
          type="primary"
          @click="clickButton(props.slideData.button?.url as string)"
        >
          {{ props.slideData.button?.label }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ISliderItem } from "~/types";
  const { handleExternalLink } = useProjectMethods();

  const props = defineProps<{
    slideData: ISliderItem;
  }>();

  const { createSrcSet } = useProjectMethods();
  const showButton = computed(() => !!props.slideData.button?.label && !!props.slideData.button?.url);
  const backgroundGradientStyle = computed(() => `background: linear-gradient(to right, ${props.slideData.colorLeft}, ${props.slideData.colorRight})`);

  const clickButton = (url:string):void => {
    if (url) handleExternalLink(url)
  };
</script>

<style src="~/assets/styles/components/card/slide.scss" lang="scss" />

