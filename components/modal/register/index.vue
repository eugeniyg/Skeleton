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
  const { closeModal, modals } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss"/>
