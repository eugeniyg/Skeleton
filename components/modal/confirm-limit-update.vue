<template>
  <vue-final-modal
    v-model="modals.confirmLimitUpdate"
    class="modal-confirm-limit-update"
    :clickToClose="true"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('confirmLimitUpdate')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.selfExlusionConfirm.updateTitle') }}</div>
      </div>

      <div class="modal-confirm-limit-update__text">
        {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.selfExlusionConfirm.updateDescription') }}
      </div>

      <div class="modal-confirm-limit-update__actions">
        <button-base type="primary" size="md" @click="save">
          {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.selfExlusionConfirm.okButtonLabel') }}
        </button-base>
        <button-base type="secondary" size="md" @click="cancel">
          {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.selfExlusionConfirm.cancelButtonLabel') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    period?: string,
  }>();

  const limitsStore = useLimitsStore();
  const { closeModal, createLimit } = limitsStore;
  const { modals } = storeToRefs(limitsStore);
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const { logOutUser } = useProfileStore();

  const save = async () => {
    closeModal('confirmLimitUpdate');
    await createLimit({
      definition: 4,
      period: props.period,
    });
    await logOutUser();
  };

  const cancel = () => {
    closeModal('confirmLimitUpdate');
  };
</script>

<style lang="scss">
.modal-confirm-limit-update {
  @extend %modal-info;
  user-select: none;

  &__text {
    @include font($body-2);
    color: var(--gray-300)
  }

  .scroll {
    grid-row-gap: 24px;
  }

  &__actions {
    display: grid;
    grid-row-gap: rem(8px);

    .btn-primary, .btn-secondary {
      --width: 100%;
      margin: 0;
    }
  }
}

</style>
