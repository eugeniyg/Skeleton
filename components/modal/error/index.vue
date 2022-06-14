<template>
  <vue-final-modal
    v-model="modals.error"
    @click="closeModal('error')"
    esc-to-close
  >
    <div class="modal-success-deposit" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('error')"/>
          <div class="title">Error</div>
        </div>
        <img class="img" src="@/assets/svg/colored/error.svg" />
        <p class="text"> Sorry, something went wrong. <br> Please, try again.</p>
        <button-base type="primary" size="md">Try again</button-base>
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
