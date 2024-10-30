<template>
  <div class="promo-card">
    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.images.mobile.backgroundImage)" >
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.desktop.backgroundImage)" >
      <atomic-image class="back" :src="props.images.mobile.backgroundImage" />
    </picture>

    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.images.mobile.faceImage)" >
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.desktop.faceImage)" >
      <atomic-image class="front" :src="props.images.mobile.faceImage" />
    </picture>

    <div class="info">
      <div v-if="props.title" class="title" v-html="DOMPurify.sanitize(marked.parse(props.title || '') as string, { FORBID_TAGS: ['style'] })" />
      <div v-if="props.content" class="content" v-html="DOMPurify.sanitize(marked.parse(props.content || '') as string, { FORBID_TAGS: ['style'] })" />

      <div v-if="props.button" class="actions">
        <button-base
          type="primary"
          size="md"
          @click="clickButton(props.button.url)"
        >
          {{ props.button.label }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import DOMPurify from "isomorphic-dompurify";

  const props = defineProps({
    images: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: false,
    },
    button: {
      type: Object,
      required: false,
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openWalletModal } = useLayoutStore();
  const { openModal } = useModalStore();
  const { createSrcSet, handleExternalLink } = useProjectMethods()

  const clickButton = (url:string):void => {
    if (url) handleExternalLink(url)
    else isLoggedIn.value ? openWalletModal('deposit') : openModal('sign-up');
  };
</script>

<style src="~/assets/styles/components/card/promo.scss" lang="scss" />

