<template>
  <vue-final-modal
    v-model="modals.signIn"
    @click="closeModal('signIn')"
    @beforeOpen="formKey++"
    esc-to-close
  >
    <div class="modal-sign-in" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('signIn')"/>
          <div class="title">Sign in</div>
        </div>

        <form-sign-in :key="formKey" :show="modals.signIn" />
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
