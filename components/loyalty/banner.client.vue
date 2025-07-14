<template>
  <div class="loyalty-banner" :style="backgroundGradientVars">
    <div class="loyalty-banner__container">
      <div class="loyalty-banner__content">
        <div class="loyalty-banner__title">
          {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'banner.title') }}
        </div>

        <div v-if="bannerSubtitle" class="loyalty-banner__sub-title">
          {{ bannerSubtitle }}
        </div>

        <div class="loyalty-banner__description">
          {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'banner.description') }}
        </div>

        <div v-if="isLoggedIn" class="loyalty-banner__loyalty">
          <div class="loyalty-banner__loyalty-level">
            <loyalty-avatar size="lg" />
            <div class="loyalty-banner__loyalty-nickname">{{ userNickname }}</div>
            <loyalty-progress />
          </div>

          <atomic-divider />

          <button-base
            type="primary"
            size="md"
            :url="loyaltyContent?.banner?.loyaltyActionButton?.url"
            :target-blank="loyaltyContent?.banner?.loyaltyActionButton?.targetBlank"
            @click="clickAction(loyaltyContent?.banner?.loyaltyActionButton?.url)"
          >
            {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'banner.loyaltyActionButton.label') }}
          </button-base>
        </div>

        <button-base v-else type="primary" size="md" @click="openModal('sign-in')">
          <atomic-icon v-if="loginButtonContent.icon" :id="loginButtonContent.icon" />
          <span>{{ loginButtonContent.label }}</span>
        </button-base>
      </div>

      <picture class="loyalty-banner__picture">
        <source :media="'(max-width: 1279px)'" :srcset="desktopImageSrcSet" />
        <source :media="'(max-width: 2264px)'" :srcset="mobileImageSrcSet" />
        <atomic-image
          class="back"
          :src="getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'banner.desktopImage')"
        />
      </picture>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  import { createSrcSet } from '@skeleton/helpers/urlBuildMethods';

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));

  const profileStore = useProfileStore();
  const { isLoggedIn, userNickname } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();

  const bannerSubtitle = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'banner.subtitle');
  });

  const loginButtonContent = computed(() => {
    const icon = getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'banner.loginButton.icon');
    const label = getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'banner.loginButton.label');
    return { icon, label };
  });

  const desktopImageSrcSet = computed(() => {
    const image = getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'banner.desktopImage');
    if (image) return createSrcSet(image);
    return '';
  });

  const mobileImageSrcSet = computed(() => {
    const image = getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'banner.mobileImage');
    if (image) return createSrcSet(image);
    return '';
  });

  const backgroundGradientVars = computed(() => {
    const topColor = getContent(
      loyaltyContent.value,
      defaultLocaleLoyaltyContent.value,
      'banner.bannerGradient.topColor'
    );
    const bottomColor = getContent(
      loyaltyContent.value,
      defaultLocaleLoyaltyContent.value,
      'banner.bannerGradient.bottomColor'
    );
    if (topColor && bottomColor) return `--banner-color-top: ${topColor}; --banner-color-bottom: ${bottomColor})`;
    return null;
  });

  const loadModal = ref(false);
  const clickAction = async (urlLink: string | undefined): Promise<void> => {
    if (urlLink || loadModal.value) return;
    loadModal.value = true;
    await openWalletModal('deposit');
    loadModal.value = false;
  };
</script>

<style src="~/assets/styles/components/loyalty/banner.scss" lang="scss" />
