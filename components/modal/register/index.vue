<template>
  <vue-final-modal
    v-model="modals.register"
    @beforeOpen="formKey++"
    esc-to-close
  >
    <div class="modal-register">
      <div class="container">
        <div class="slot">
          <atomic-promo/>
        </div>

        <div class="scroll">
          <div class="header">
            <button-modal-close @close="closeModal('register')"/>
            <div class="title">Join Slotsbet</div>
          </div>
          <form-join :key="formKey" :show="modals.register"/>
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
  const formKey = ref<number>(0);
</script>

<style lang="scss" src="./style.scss"/>
