<template>
  <vue-final-modal
    v-model="modals.signIn"
    @click="closeModal('signIn')"
    @closed="closeModal('signIn')"
    esc-to-close
  >
    <div class="modal-sign-in" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('signIn')"/>
          <div class="title">Sign in</div>
        </div>

        <form-sign-in :show="modals.signIn" />
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
