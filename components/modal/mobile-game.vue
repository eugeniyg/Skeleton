<template>
  <vue-final-modal
    class="modal-mobile-game"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <button-modal-close @close="closeModal('mobile-game')" />

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
              :game-id="mobileGameModalInfo?.id as string"
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
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['mobileGame']>;
    defaultLocaleData: Maybe<IModalsContent['mobileGame']>;
  }>();

  const gameStore = useGamesStore();
  const { mobileGameModalType, mobileGameModalInfo } = storeToRefs(gameStore);
  const { getImageUrl, getContent, localizePath } = useProjectMethods();
  const { openModal, closeModal, openWalletModal } = useModalStore();
  const router = useRouter();

  const gameImage = computed(() =>
    getImageUrl(mobileGameModalInfo.value?.customImages, mobileGameModalInfo.value?.images, 'vertical')
  );

  const depositButtonLabel = getContent(props.currentLocaleData, props.defaultLocaleData, 'deposit');
  const playDemoButtonLabel = getContent(props.currentLocaleData, props.defaultLocaleData, 'demo');
  const registrationButtonLabel = getContent(props.currentLocaleData, props.defaultLocaleData, 'registration');

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
      secondary: getContent(props.currentLocaleData, props.defaultLocaleData, 'login'),
      description: getContent(props.currentLocaleData, props.defaultLocaleData, 'onlyReal'),
    },
  };

  const handlePrimaryClick = async (): Promise<void> => {
    if (['depositOrDemo', 'deposit'].includes(mobileGameModalType.value as string)) {
      await openWalletModal('deposit');
    } else {
      await openModal('sign-up');
    }

    await nextTick();
    await closeModal('mobile-game');
  };

  const handleSecondaryClick = async (): Promise<void> => {
    if (['depositOrDemo', 'registerOrDemo'].includes(mobileGameModalType.value as string)) {
      await router.push(localizePath(`/games/${mobileGameModalInfo.value?.identity}`));
    } else {
      await openModal('sign-in');
    }

    await nextTick();
    await closeModal('mobile-game');
  };
</script>

<style src="~/assets/styles/components/modal/mobile-game.scss" lang="scss" />
