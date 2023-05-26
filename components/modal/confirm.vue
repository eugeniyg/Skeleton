<template>
  <vue-final-modal
    v-model="modals.confirm"
    class="modal-confirm"
    :clickToClose="false"
    @clickOutside="closeModal('confirm')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('confirm')"/>
      </div>

      <img class="img" src="/img/confirm.svg"/>
      <p class="text">{{ getContent(popupsData, defaultLocalePopupsData, 'confirm.title') }}</p>
      <button-base type="primary" size="md" @click="closeModal('confirm')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'confirm.button') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
</script>

<style lang="scss">
.modal-confirm {
  @extend %modal-info;

  .scroll {
    img {
      margin: rem(-22px) auto 0;
    }
  }

  .text {
    @include font($heading-5);
    text-align: center;
    color: var(--white);
    margin: 0 0;
  }

  .btn-primary {
    margin: rem(8px) auto 0;
    --width: 100%;
  }
}
</style>
