<template>
  <div class="card-loyalty" :style="backgroundGradientVars">
    <div class="card-loyalty__content">
      <div class="card-loyalty__title" v-if="props.content.title" v-html="marked.parse(props.content.title)"/>
      <div class="card-loyalty__sub-title" v-if="props.content.subTitle" v-html="marked.parse(props.content.subTitle)"/>
      <div class="card-loyalty__description" v-if="props.content.description" v-html="marked.parse(props.content.description)"/>
      
      <button-base
        type="primary"
        size="lg"
        @click="clickButton(props.content.button.url)"
        v-if="!isLoggedIn"
      >
        <atomic-icon id="cherry"/>
        <span>{{ props.content.button.label }}</span>
      </button-base>
      
      <div v-else>
      
      </div>
    </div>
    
    <picture class="card-loyalty__picture">
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.content.images.mobile.backgroundImage)"/>
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.content.images.desktop.backgroundImage)"/>
      <atomic-image class="back" :src="props.content.images.mobile.backgroundImage"/>
    </picture>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  
  const props = defineProps<{
    content: ILoyaltyPage['banner']
  }>();
  
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const {
    showModal,
    openWalletModal
  } = useLayoutStore();
  const {
    createSrcSet,
    handleExternalLink
  } = useProjectMethods();
  
  const clickButton = (url: string): void => {
    if (url) {
      handleExternalLink(url);
    } else {
      isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
    }
  };
  
  const backgroundGradientVars = computed(() => {
    return props.content.colorTop && props.content.colorBottom ? `--banner-color-top: ${props.content.colorTop}; --banner-color-bottom: ${props.content.colorBottom})` : '';
  });

</script>

<style src="~/assets/styles/components/card/loyalty.scss" lang="scss"/>
