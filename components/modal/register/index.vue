<template>
  <vue-final-modal
    v-model="modals.register"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
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
            <div class="title">{{ registrationContent?.title }}</div>
          </div>
          <form-join v-if="showForm"/>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { RegistrationInterface } from '~/types';

  const showForm = ref<boolean>(false);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const registrationContent: RegistrationInterface|undefined = popupsData?.registration;
</script>

<style lang="scss" src="./style.scss"/>
