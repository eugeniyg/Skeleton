<template>
  <vue-final-modal
    v-model="showMobileGameModal"
    class="modal-mobile-game"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <button-modal-close @close="showMobileGameModal = false" />

      <atomic-image class="game-return__background" :src="gameImage" />

      <div class="modal-mobile-game__container">
        <div class="modal-mobile-game__content">
          <div class="modal-mobile-game__thumb">
            <atomic-image :src="gameImage" />
          </div>

          <div class="modal-mobile-game__info">
            <div class="modal-mobile-game__title">{{ mobileGameModalInfo?.name }}</div>
            <div class="modal-mobile-game__subtitle">{{ mobileGameModalInfo?.provider?.name }}</div>

            <div v-if="mobileGameModalType === 'registerOrLogin'" class="modal-mobile-game__description">
              {{ modalContent[mobileGameModalType].description }}
            </div>

            <button-favorite
              v-if="['depositOrDemo', 'deposit'].includes(mobileGameModalType || '')"
              :game-id="mobileGameModalInfo?.id"
            />
          </div>
        </div>

        <div class="modal-mobile-game__controls">
          <button-base type="primary" size="lg" @click.once="handlePrimaryClick">
            <atomic-icon v-if="['depositOrDemo', 'deposit'].includes(mobileGameModalType || '')" id="play" />
            <atomic-icon v-else id="user-new" />
            {{ modalContent[mobileGameModalType || '']?.primary }}
          </button-base>

          <button-base
            v-if="modalContent[mobileGameModalType || '']?.secondary"
            type="secondary"
            size="lg"
            @click.once="handleSecondaryClick"
          >
            {{ modalContent[mobileGameModalType || '']?.secondary }}
          </button-base>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  const gameStore = useGamesStore();
  const { showMobileGameModal, mobileGameModalType, mobileGameModalInfo } = storeToRefs(gameStore);
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getImageUrl, getContent, localizePath } = useProjectMethods();
  const { openModal, openWalletModal } = useModalStore();
  const router = useRouter();

  const gameImage = computed(() => {
    if (mobileGameModalInfo.value?.images?.hasOwnProperty('200x300')) {
      return getImageUrl(mobileGameModalInfo.value.images, 'vertical');
    }
    return '';
  });

  const depositButtonLabel = getContent(popupsData, defaultLocalePopupsData, 'mobileGame.deposit');
  const playDemoButtonLabel = getContent(popupsData, defaultLocalePopupsData, 'mobileGame.demo');
  const registrationButtonLabel = getContent(popupsData, defaultLocalePopupsData, 'mobileGame.registration');

  const modalContent: Record<string, any> = {
    depositOrDemo: {
      primary: depositButtonLabel,
      secondary: playDemoButtonLabel,
    },
    deposit: {
      primary: depositButtonLabel,
    },
    registerOrDemo: {
      primary: registrationButtonLabel,
      secondary: playDemoButtonLabel,
    },
    registerOrLogin: {
      primary: registrationButtonLabel,
      secondary: getContent(popupsData, defaultLocalePopupsData, 'mobileGame.login'),
      description: getContent(popupsData, defaultLocalePopupsData, 'mobileGame.onlyReal'),
    },
  };

  const handlePrimaryClick = async (): Promise<void> => {
    if (['depositOrDemo', 'deposit'].includes(mobileGameModalType.value as string)) {
      await openWalletModal('deposit');
    } else {
      await openModal('sign-up');
    }

    showMobileGameModal.value = false;
  };

  const handleSecondaryClick = (): void => {
    if (['depositOrDemo', 'registerOrDemo'].includes(mobileGameModalType.value as string)) {
      router.push(localizePath(`/games/${mobileGameModalInfo.value?.identity}`));
    } else {
      openModal('sign-in');
    }

    showMobileGameModal.value = false;
  };
</script>

<style src="~/assets/styles/components/modal/mobile-game.scss" lang="scss" />
