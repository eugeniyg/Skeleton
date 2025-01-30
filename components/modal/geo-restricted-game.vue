<template>
  <vue-final-modal
    class="modal-geo-restricted-game"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('geo-restricted-game')" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>
      
      <atomic-image :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image') "/>
      
      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>
      
      <div class="actions">
        <button-base type="primary" size="md" @click.once="confirm">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button.label') }}
        </button-base>
      </div>
    </div>
  
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';
  
  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['geoRestrictedGame']>;
    defaultLocaleData: Maybe<IModalsContent['geoRestrictedGame']>;
  }>();
  
  const { getContent } = useProjectMethods();
  const { closeModal } = useModalStore();
  const confirm = async (): Promise<void> => {
    
    await closeModal('geo-restricted-game');
  };
</script>

<style src="~/assets/styles/components/modal/geo-restricted-game.scss" lang="scss" />