<template>
  <vue-final-modal
    v-model="modals.signIn"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
    esc-to-close
  >
    <div class="modal-sign-in">
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('signIn')"/>
          <div class="title">{{ loginContent?.title }}</div>
        </div>

        <form-sign-in v-if="showForm" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { LoginInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const showForm = ref<boolean>(false);
  const { popupsData } = useGlobalStore();
  const loginContent: LoginInterface|undefined = popupsData?.login;
</script>

<style lang="scss">
.modal-sign-in {
  @extend %modal-info;
}
</style>
