<template>
  <vue-final-modal
    class="modal-cancel-lottery"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('cancel-lottery')" />
      </div>

      <atomic-image class="img" :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')" />

      <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>

      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>

      <div class="modal-cancel-lottery__actions">
        <button-base type="primary" size="md" @click="closeModal('cancel-lottery')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButton') }}
        </button-base>

        <button-base type="ghost" size="xs" :is-disabled="isLotteryUpdating" @click="confirmAction">
          <atomic-spinner :is-shown="isLotteryUpdating" />
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { ICancelLotteryModal } from '~/types';
  import { getContent } from '#imports';
  import { changeProfileData } from '@skeleton/api/profile';
  const { setProfileData } = useProfileStore();
  const lotteryStore = useLotteryStore();
  const { isLotteryUpdating } = storeToRefs(lotteryStore);

  const props = defineProps<{
    currentLocaleData: Maybe<ICancelLotteryModal>;
    defaultLocaleData: Maybe<ICancelLotteryModal>;
  }>();
  
  const { closeModal } = useModalStore();
  
  const confirmAction =  async () => {
    try {
      isLotteryUpdating.value = true;
      const submitResult = await changeProfileData({ inLottery: false });
      setProfileData(submitResult);
      isLotteryUpdating.value = false;
      await closeModal('cancel-lottery');
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };
</script>

<style src="~/assets/styles/components/modal/cancel-lottery.scss" lang="scss" />
