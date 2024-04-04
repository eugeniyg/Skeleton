<template>
  <div class="promo-card">
    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.images.mobile.backgroundImage)" />
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.desktop.backgroundImage)" />
      <atomic-image class="back" :src="props.images.mobile.backgroundImage" />
    </picture>

    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.images.mobile.faceImage)" />
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.desktop.faceImage)" />
      <atomic-image class="front" :src="props.images.mobile.faceImage" />
    </picture>

    <div class="info">
      <div class="title" v-if="props.title" v-html="marked.parse(props.title)" />
      <div class="content" v-if="props.content" v-html="marked.parse(props.content)" />

      <div class="actions" v-if="props.button">
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
  const { showModal, openWalletModal } = useLayoutStore();
  const { createSrcSet, handleExternalLink } = useProjectMethods()

  const clickButton = (url:string):void => {
    if (url) handleExternalLink(url)
    else isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
  };
</script>

<style src="~/assets/styles/components/card/promo.scss" lang="scss" />

