<template>
  <vue-final-modal
    v-model="modals.signIn"
    class="modal-sign-in"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('signIn')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'login.title') }}</div>
      </div>

      <form-sign-in />
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
</script>

<style src="~/assets/styles/components/modal/sign-in.scss" lang="scss" />

