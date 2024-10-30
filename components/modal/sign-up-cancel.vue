<template>
  <vue-final-modal
    :clickToClose="false"
    class="modal-register-cancel"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
    @clickOutside="closeAllModals"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeAllModals"/>
        <h4 class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</h4>
      </div>

      <div class="bonus">
        <atomic-image :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'bonusImage')" />
        <div class="bonus-text" v-html="bonusContent" />
      </div>

      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="closeModal('sign-up-cancel')"
        >
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'backButton') }}
        </button-base>

        <button-base
          type="ghost"
          size="xs"
          @click="closeAllModals"
        >
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'closeButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import {VueFinalModal} from 'vue-final-modal';
  import type {IModalsContent} from "~/types";

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['cancelRegistration']>;
    defaultLocaleData: Maybe<IModalsContent['cancelRegistration']>;
  }>();

  const { closeModal, closeAllModals } = useModalStore();
  const { getContent } = useProjectMethods();

  const { replaceContent } = useProjectMethods();
  const bonusContent = getContent(props.currentLocaleData, props.defaultLocaleData, 'bonusText')
    ? replaceContent(getContent(props.currentLocaleData, props.defaultLocaleData, 'bonusText'), '*') : '';
</script>

<style src="~/assets/styles/components/modal/sign-up-cancel.scss" lang="scss" />

