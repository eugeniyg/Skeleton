<template>
  <vue-final-modal
    v-model="modals.confirm"
    class="modal-confirm"
    :clickToClose="false"
    @clickOutside="closeModal('confirm')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('confirm')"/>
      </div>

      <img class="img" src="/img/confirm.svg"/>
      <p class="text">{{ getContent(popupsData, defaultLocalePopupsData, 'profileConfirmed.title') }}</p>
      <button-base type="primary" size="md" @click="closeModal('confirm')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'profileConfirmed.button') }}
      </button-base>
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

<style src="~/assets/styles/components/modal/confirm.scss" lang="scss" />

