<template>
  <div class="card-home">
    <div class="content">
      <div v-if="props.images?.backgroundImage" class="back-bg">
        <atomic-picture :src="props.images.backgroundImage" not-lazy />
      </div>

      <div v-if="props.images?.faceImage" class="front-bg">
        <atomic-picture :src="props.images.faceImage" not-lazy />
      </div>
    </div>

    <client-only>
      <div v-if="isLoggedIn && props.showLoyalty && loyaltyEnabled" class="loyalty-home">
        <div v-if="loyaltyWelcomeTitle" class="loyalty-home__title">{{ loyaltyWelcomeTitle }}</div>

        <div v-if="props.bannerLoyalty?.subtitle" class="loyalty-home__sub-title">
          {{ props.bannerLoyalty.subtitle }}
        </div>

        <div class="loyalty-home__level">
          <loyalty-level-logo />
          <loyalty-progress />
        </div>
      </div>

      <div v-else class="info">
        <div
          v-if="props.title"
          class="title"
          v-html="DOMPurify.sanitize(marked.parse(props.title || '') as string, { FORBID_TAGS: ['style'] })"
        />

        <div
          v-if="props.content"
          class="card-home__content"
          v-html="DOMPurify.sanitize(marked.parse(props.content || '') as string, { FORBID_TAGS: ['style'] })"
        />

        <div v-if="props.button && props.button?.showButton" class="actions">
          <button-base type="primary" size="md" @click="clickButton(props.button.url)">
            <atomic-icon :id="props.button.icon" />
            {{ props.button.label }}
          </button-base>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    images: {
      backgroundImage: string;
      faceImage: string;
    };
    title: string;
    content: string;
    button: {
      showButton?: boolean;
      label: string;
      url: string;
      icon: string;
    };
    bannerLoyalty?: {
      welcomeTitle?: string;
      subtitle?: string;
    };
    showLoyalty?: boolean;
  }>();

  const profileStore = useProfileStore();
  const { isLoggedIn, userNickname } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();
  const { handleExternalLink } = useProjectMethods();
  const runtimeConfig = useRuntimeConfig();
  const loyaltyEnabled = runtimeConfig.public?.loyaltyEnabled;

  const loyaltyWelcomeTitle = computed(() => {
    if (!props.bannerLoyalty?.welcomeTitle) return undefined;
    return props.bannerLoyalty.welcomeTitle.replace('{nickname}', userNickname.value);
  });

  const clickButton = (url: string): void => {
    if (url) handleExternalLink(url);
    else if (isLoggedIn.value) openWalletModal('deposit');
    else openModal('sign-up');
  };
</script>

<style src="~/assets/styles/components/card/home.scss" lang="scss" />
