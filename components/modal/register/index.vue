<template>
  <vue-final-modal
    v-model="modals.register"
    @closed="closeModal('register')"
    @click="closeModal('register')"
  >
    <div class="modal-register" data-id="register" @click.stop>
      <div class="container">
        <div class="slot">
          <atomic-promo/>
        </div>

        <div class="scroll">
          <div class="header">
            <button-modal-close @close="closeModal('register')"/>
            <div class="title">Join Slotsbet</div>
          </div>
          <form-join :show="modals.register"/>
        </div>
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
