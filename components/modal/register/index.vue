<template>
  <vue-final-modal
    classes="modal-container"
    v-model="modals.register"
    @closed="closeModal('register')"
  >
    <div class="modal-register">
      <atomic-promo/>

      <div class="header">
        <button-modal-close @close="closeModal('register')"/>
        <div class="title">Join Slotsbet</div>
      </div>

      <div class="content">
        <form-join/>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
</script>

<style lang="scss" src="./style.scss"/>
