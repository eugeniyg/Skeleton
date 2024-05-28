<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    class="modal-forgot-pass"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button class="modal-forgot-pass__previous" @click.prevent="returnLoginModal">
          <atomic-icon id="arrow_previous"/>
        </button>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'forgot.title') }}</div>
        <button class="modal-forgot-pass__close" @click.prevent="closeModal('forgotPass')">
          <atomic-icon id="close"/>
        </button>
      </div>

      <p class="text">
        {{ getContent(popupsData, defaultLocalePopupsData, 'forgot.description') }}
      </p>
      <form-forgot-pass />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const returnLoginModal = () => {
    showModal('signIn');
  };
</script>

<style src="~/assets/styles/components/modal/forgot-pass.scss" lang="scss" />

