<template>
  <vue-final-modal
    v-model="modals.registerCancel"
    :clickToClose="false"
    @clickOutside="closeRegistration"
    class="modal-register-cancel"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeRegistration"/>
        <h4 class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'cancelRegistration.title') }}</h4>
      </div>

      <div class="bonus">
        <atomic-image :src="getContent(popupsData, defaultLocalePopupsData, 'cancelRegistration.bonusImage')" />
        <div class="bonus-text" v-html="bonusContent" />
      </div>

      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="closeModal('registerCancel')"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'cancelRegistration.backButton') }}
        </button-base>

        <button-base
          type="ghost"
          size="xs"
          @click="closeRegistration"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'cancelRegistration.closeButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const { replaceContent } = useProjectMethods();
  const bonusContent = getContent(popupsData, defaultLocalePopupsData, 'cancelRegistration.bonusText')
    ? replaceContent(getContent(popupsData, defaultLocalePopupsData, 'cancelRegistration.bonusText'), '*') : '';

  const closeRegistration = ():void => {
    closeModal('register');
    closeModal('registerCancel');
  }
</script>

<style src="~/assets/styles/components/modal/register-cancel.scss" lang="scss" />

