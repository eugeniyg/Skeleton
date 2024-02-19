<template>
  <vue-final-modal
    v-model="modals.gameLimitReached"
    class="game-limit-reached"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('gameLimitReached')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'gameLimitReached.label') }}</div>
      </div>

      <div class="game-limit-reached__text">
        {{ getContent(popupsData, defaultLocalePopupsData, 'gameLimitReached.description') }}
      </div>

    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  const limitsStore = useLimitsStore();
  const { closeModal } = limitsStore;
  const { modals } = storeToRefs(limitsStore);
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/game-limit-reached.scss" lang="scss" />
