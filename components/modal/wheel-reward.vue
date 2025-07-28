<template>
  <vue-final-modal
    class="modal-wheel-reward"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('wheel-reward')" />
      </div>

      <atomic-picture
        class="modal-wheel-reward__img"
        :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')"
      />

      <div class="modal-wheel-reward__title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
      </div>

      <p class="modal-wheel-reward__text">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}
      </p>

      <div class="modal-wheel-reward__reward">
        <span class="modal-wheel-reward__reward-title">{{ props.rewardInfo.title }}</span>
        <atomic-picture v-if="props.sectorImg" class="modal-wheel-reward__reward-img" :src="props.sectorImg" />
        <span v-if="rewardInfo.dropRate" class="modal-wheel-reward__reward-rate">{{ rewardInfo.dropRate }}%</span>
      </div>

      <button-base v-if="!props.hideButton" type="primary" size="md" @click="handleClick">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button.label') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IWheelRewardModal } from '~/types';
  import type { IWheelSector } from '@skeleton/api/types/wheelsTypes';

  const props = defineProps<{
    currentLocaleData: Maybe<IWheelRewardModal>;
    defaultLocaleData: Maybe<IWheelRewardModal>;
    rewardInfo: IWheelSector;
    sectorImg: string | undefined;
    hideButton: boolean;
  }>();

  const { closeModal, openWalletModal } = useModalStore();
  const router = useRouter();
  const buttonUrl = getContent(props.currentLocaleData, props.defaultLocaleData, 'button.url');
  const handleClick = async (): Promise<void> => {
    if (buttonUrl) {
      await router.push(localizePath(buttonUrl));
      await closeModal('wheel-reward');
    } else {
      await openWalletModal();
      await closeModal('wheel-reward');
    }
  };
</script>

<style src="~/assets/styles/components/modal/wheel-reward.scss" lang="scss" />
