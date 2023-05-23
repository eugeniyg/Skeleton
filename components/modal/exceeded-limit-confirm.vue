<template>
  <vue-final-modal
    v-model="modals.exceededLimitConfirm"
    class="modal-exceeded-limit-confirm"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('exceededLimitConfirm')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.exceededLimitConfirm.label') }}</div>
      </div>

      <div class="modal-exceeded-limit-confirm__text">
        {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.exceededLimitConfirm.description') }}
      </div>

    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  const limitsStore = useLimitsStore();
  const { closeModal } = limitsStore;
  const { modals } = storeToRefs(limitsStore);
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
</script>

<style lang="scss">
.modal-exceeded-limit-confirm {
  @extend %modal-info;
  user-select: none;

  &__text {
    @include font($body-2);
    color: var(--gray-300)
  }

  .scroll {
    grid-row-gap: 24px;
  }
}

</style>
