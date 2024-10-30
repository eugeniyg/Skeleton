<template>
  <vue-final-modal
    class="modal-reset-pass"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('reset-pass')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'reset.title') }}</div>
      </div>

      <form-reset-pass />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';

  const { closeModal } = useModalStore();
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/reset-pass.scss" lang="scss" />

