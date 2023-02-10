<template>
  <vue-final-modal
    v-model="modals.signIn"
    class="modal-sign-in"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('signIn')"/>
        <div class="title">{{ loginContent?.title }}</div>
      </div>

      <form-sign-in />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import { LoginInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const loginContent: LoginInterface|undefined = popupsData?.login;
</script>

<style lang="scss">
.modal-sign-in {
  @extend %modal-info;
}
</style>
