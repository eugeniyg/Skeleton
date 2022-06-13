<template>
  <vue-final-modal
    v-model="modals.deposit"
    @click="closeModal('deposit')"
    esc-to-close
  >
    <div class="modal-deposit" @click.stop>
      <div class="container">
        <div class="slot">
          <balance>
            <form-input-payments name="name8" :options="depositItems()" />
          </balance>
        </div>

        <div class="scroll">
          <div class="header">
            <button-modal-close @close="closeModal('deposit')"/>
            <div class="title">Deposit</div>
          </div>
          <form-deposit/>
          <form-deposit-additional/>
          <form-deposit-crypto/>
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

  const { depositItems } = useFakeStore();
</script>

<style lang="scss" src="./style.scss"/>
