<template>
  <vue-final-modal
    v-model="modals.turnOverWager"
    class="modal-turn-over-wager"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('turnOverWager')" />
      </div>

      <wallet-turn-over-wager />

      <button-base
        type="primary"
        size="md"
        @click="closeModal('turnOverWager')"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'turnOverWager.buttonLabel') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import {storeToRefs} from "pinia";

  const layoutStore = useLayoutStore();
  const { closeModal } = layoutStore;
  const { modals } = storeToRefs(layoutStore);
  const { getContent } = useProjectMethods();
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
</script>

<style src="~/assets/styles/components/modal/turn-over-wager.scss" lang="scss" />

