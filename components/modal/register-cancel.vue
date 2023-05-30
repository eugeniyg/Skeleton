<template>
  <vue-final-modal
    v-model="modals.registerCancel"
    :clickToClose="false"
    @clickOutside="closeModal('registerCancel')"
    class="modal-register-cancel"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('registerCancel')"/>
        <h4 class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'registrationCancel.title') }}</h4>
      </div>

      <div class="bonus">
        <img :src="getContent(popupsData, defaultLocalePopupsData, 'registrationCancel.bonusImage')" alt="">
        <div class="bonus-text" v-html="bonusContent" />
      </div>

      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="showModal('register')"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'registrationCancel.backButton') }}
        </button-base>

        <button-base
          type="ghost"
          size="xs"
          @click="closeModal('registerCancel')"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'registrationCancel.closeButton') }}
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
  const { showModal, closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const { replaceContent } = useCoreMethods();
  const bonusContent = getContent(popupsData, defaultLocalePopupsData, 'registrationCancel.bonusText')
    ? replaceContent(getContent(popupsData, defaultLocalePopupsData, 'registrationCancel.bonusText'), '*') : '';
</script>

<style src="~/assets/styles/components/modal/register-cancel.scss" lang="scss" />

