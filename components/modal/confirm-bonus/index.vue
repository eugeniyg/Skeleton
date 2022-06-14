<template>
  <vue-final-modal
    v-model="modals.confirmBonus"
    @click="closeModal('confirmBonus')"
    esc-to-close
  >
    <div class="modal-confirm-bonus" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('confirmBonus')"/>
          <div class="title">Confirm bonus update</div>
        </div>

        <p class="text"> The status of the currently active bonus will change to Cancelled. Are you sure you want to activate this bonus?</p>

        <div class="actions">
          <button-base type="primary" size="md">Yes</button-base>
          <button-base type="secondary" size="md">No</button-base>
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
