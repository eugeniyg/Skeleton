<template>
  <div class="card-slide" :style="backgroundGradientStyle">
    <picture class="card-slide__picture card-slide__picture">
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.slideData.mobileImage)" >
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.slideData.desktopImage)" >
      <atomic-image class="card-slide__img card-slide__img" :src="props.slideData.mobileImage" />
    </picture>

    <div class="card-slide__info">
      <div class="card-slide__title">{{ props.slideData.title }}</div>
      <div
        v-if="props.slideData.content"
        class="card-slide__content"
        v-html="DOMPurify.sanitize(marked.parse(props.slideData.content) as string, { FORBID_TAGS: ['style'] })"
      />
      
      <div v-if="showButton" class="card-slide__actions">
        <atomic-link
          class="btn-primary"
          :targetBlank="props.slideData?.button?.targetBlank"
          :href="props.slideData.button?.url"
        >
          {{ props.slideData.button?.label }}
        </atomic-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ISliderItem } from "~/types";
  import DOMPurify from "isomorphic-dompurify";

  const props = defineProps<{
    slideData: ISliderItem;
  }>();

  const { createSrcSet } = useProjectMethods();
  const showButton = computed(() => !!props.slideData.button?.label && !!props.slideData.button?.url);
  const backgroundGradientStyle = computed(() => `background: linear-gradient(to right, ${props.slideData.colorLeft}, ${props.slideData.colorRight})`);
  
</script>

<style src="~/assets/styles/components/card/slide.scss" lang="scss" />

