<template>
  <vue-final-modal
    class="modal-loyalty-earn"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('loyalty-earn')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyalty-earn')" />
      </div>

      <atomic-image
        class="modal-loyalty-earn__img"
        :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')"
      />

      <div class="modal-loyalty-earn__title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
      </div>

      <div class="modal-loyalty-earn__description">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}
      </div>

      <div class="modal-loyalty-earn__steps">
        <div v-for="(step, index) in steps" :key="index" class="modal-loyalty-earn__steps-item">{{ step }}</div>
      </div>

      <button-base type="primary" size="md" @click.once="handleConfirm">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'buttonLabel') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['loyaltyEarn']>;
    defaultLocaleData: Maybe<IModalsContent['loyaltyEarn']>;
  }>();

  const { openWalletModal, closeModal, openModal } = useModalStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const steps = computed(() => {
    const contentSteps: { stepText: string }[] | undefined = getContent(
      props.currentLocaleData,
      props.defaultLocaleData,
      'steps'
    );
    if (contentSteps) return contentSteps.map(step => step.stepText);
    return [];
  });

  const handleConfirm = async (): Promise<void> => {
    if (isLoggedIn.value) await openWalletModal('deposit');
    else await openModal('sign-up');
    await closeModal('loyalty-earn');
  };
</script>

<style src="~/assets/styles/components/modal/loyalty-earn.scss" lang="scss" />
