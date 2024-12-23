<template>
  <vue-final-modal
    class="modal-turn-over-wager"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('turn-over-wager')" />
      </div>

      <wallet-turn-over-wager />

      <button-base type="primary" size="md" @click="closeModal('turn-over-wager')">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'buttonLabel') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['turnOverWager']>;
    defaultLocaleData: Maybe<IModalsContent['turnOverWager']>;
  }>();

  const { closeModal } = useModalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/turn-over-wager.scss" lang="scss" />
