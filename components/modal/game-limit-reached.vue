<template>
  <vue-final-modal
    class="game-limit-reached"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('game-limit-reached')" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'label') }}</div>
      </div>

      <div class="game-limit-reached__text">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['gameLimitReached']>;
    defaultLocaleData: Maybe<IModalsContent['gameLimitReached']>;
  }>();

  const { closeModal } = useModalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/game-limit-reached.scss" lang="scss" />
