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
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>

      <form-reset-pass :currentLocaleData="props.currentLocaleData" :defaultLocaleData="props.defaultLocaleData" />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from "~/types";

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['reset']>;
    defaultLocaleData: Maybe<IModalsContent['reset']>;
  }>();

  const { closeModal } = useModalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/reset-pass.scss" lang="scss" />

