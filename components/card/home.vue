<template>
  <div class="card-home">
    <div class="content">
      <div
        v-if="props.images?.backgroundImage"
        class="back-bg"
      >
        <atomic-picture :src="props.images.backgroundImage" notLazy/>
      </div>

      <div
        v-if="props.images?.faceImage"
        class="front-bg"
      >
        <atomic-picture :src="props.images.faceImage" notLazy />
      </div>
    </div>

    <client-only>
      <div class="loyalty-home" v-if="isLoggedIn && props.showLoyalty && loyaltyEnabled">
        <div v-if="loyaltyWelcomeTitle" class="loyalty-home__title">{{ loyaltyWelcomeTitle }}</div>

        <div v-if="props.bannerLoyalty?.subtitle" class="loyalty-home__sub-title">
          {{ props.bannerLoyalty.subtitle }}
        </div>

        <div class="loyalty-home__level">
          <loyalty-level-logo />
          <loyalty-progress />
        </div>
      </div>

      <div class="info" v-else>
        <div class="title" v-if="props.title" v-html="marked.parse(props.title)"/>
        <div class="card-home__content" v-if="props.content" v-html="marked.parse(props.content)"/>

        <div class="actions" v-if="props.button">
          <button-base
            type="primary"
            size="md"
            @click="clickButton(props.button.url)"
          >
            <atomic-icon :id="props.button.icon" />
            {{ props.button.label }}
          </button-base>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';

  const props = defineProps<{
    images: {
      backgroundImage: string;
      faceImage: string;
    };
    title: string;
    content: string;
    button: {
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
  const { showModal, openWalletModal } = useLayoutStore();
  const { handleExternalLink } = useProjectMethods();
  const runtimeConfig = useRuntimeConfig();
  const loyaltyEnabled = runtimeConfig.public?.loyaltyEnabled;

  const loyaltyWelcomeTitle = computed(() => {
    if (!props.bannerLoyalty?.welcomeTitle) return undefined;
    return props.bannerLoyalty.welcomeTitle.replace('{nickname}', userNickname.value);
  })

  const clickButton = (url: string): void => {
    if (url) handleExternalLink(url)
    else isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
  };
</script>

<style src="~/assets/styles/components/card/home.scss" lang="scss" />
