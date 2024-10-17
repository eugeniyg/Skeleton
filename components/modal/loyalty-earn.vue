<template>
  <vue-final-modal
    v-model="modals.loyaltyEarn"
    class="modal-loyalty-earn"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @clickOutside="closeModal('loyaltyEarn')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyaltyEarn')"/>
      </div>

      <atomic-image
        class="modal-loyalty-earn__img"
        :src="getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.image')"
      />

      <div class="modal-loyalty-earn__title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.title') }}
      </div>

      <div class="modal-loyalty-earn__description">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.description') }}
      </div>

      <div class="modal-loyalty-earn__steps">
        <div v-for="step in steps" class="modal-loyalty-earn__steps-item">{{ step }}</div>
      </div>

      <button-base type="primary" size="md" @click.once="handleConfirm">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.buttonLabel') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, openWalletModal } = layoutStore;
  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const steps = computed(() => {
    const contentSteps: { stepText: string }[]|undefined = getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.steps');
    if (contentSteps) return contentSteps.map(step => step.stepText);
    return [];
  })

  const handleConfirm = async ():Promise<void> => {
    await openWalletModal('deposit');
    closeModal('loyaltyEarn');
  }
</script>

<style src="~/assets/styles/components/modal/loyalty-earn.scss" lang="scss"/>