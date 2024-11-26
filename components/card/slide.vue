<template>
  <div
    class="card-slide"
    :style="backgroundGradientStyle"
    :class="{
      'card-slide--clickable': props.slideData.slideLink?.url,
      'card-has-badge': props.slideData?.badge?.text,
    }"
    @click="slideHandleClick"
  >
    <picture class="card-slide__picture card-slide__picture">
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.slideData.mobileImage)" />
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.slideData.desktopImage)" />
      <atomic-image class="card-slide__img card-slide__img" :src="props.slideData.mobileImage" />
    </picture>

    <div class="card-slide__info">
      <div v-if="props.slideData?.badge?.text" class="card-slide__badge" :style="badgeStyleVars">
        {{ props.slideData?.badge?.text }}
      </div>

      <div class="card-slide__content-container">
        <div class="card-slide__title">{{ props.slideData.title }}</div>
        <div
          v-if="props.slideData.content"
          class="card-slide__content"
          v-html="DOMPurify.sanitize(marked.parse(props.slideData.content) as string, { FORBID_TAGS: ['style'] })"
        />
      </div>

      <div v-if="showButton" class="card-slide__actions">
        <atomic-link
          class="btn-primary"
          :target-blank="props.slideData?.button?.targetBlank"
          :href="props.slideData.button?.url"
          @click.stop
        >
          {{ props.slideData.button?.label }}
        </atomic-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ISliderItem } from '~/types';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    slideData: ISliderItem;
  }>();

  const router = useRouter();
  const { createSrcSet, localizePath } = useProjectMethods();
  const showButton = computed(() => !!props.slideData.button?.label && !!props.slideData.button?.url);
  const backgroundGradientStyle = computed(
    () => `background: linear-gradient(to right, ${props.slideData.colorLeft}, ${props.slideData.colorRight})`
  );

  const badgeStyleVars = computed(() => [
    props.slideData?.badge?.textColor ? `--card-badge-color: ${props.slideData?.badge?.textColor}` : null,
    props.slideData?.badge?.backgroundColor
      ? `--card-badge-background: ${props.slideData?.badge?.backgroundColor}`
      : null,
  ]);

  const slideHandleClick = (): void => {
    const url = props.slideData.slideLink?.url;
    const targetBlankParam = props.slideData.slideLink?.targetBlank;
    if (!url) return;

    if (url.startsWith('http')) window.open(url, targetBlankParam ? '_blank' : '_self');
    else if (targetBlankParam) window.open(localizePath(url), '_blank');
    else router.push(localizePath(url));
  };
</script>

<style src="~/assets/styles/components/card/slide.scss" lang="scss" />
