<template>
  <vue-final-modal
    v-model="modals.resetPass"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
    esc-to-close
  >
    <div class="modal-reset-pass">
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('resetPass')"/>
          <div class="title">Reset account <br> password</div>
        </div>

        <form-reset-pass v-if="showForm" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const showForm = ref<boolean>(false);
</script>

<style lang="scss" src="./style.scss"/>
