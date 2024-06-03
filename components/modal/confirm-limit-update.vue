<template>
  <vue-final-modal
    v-model="modals.confirmLimitUpdate"
    class="modal-confirm-limit-update"
    :clickToClose="true"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('confirmLimitUpdate')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'selfExclusionConfirm.updateTitle') }}</div>
      </div>

      <div class="modal-confirm-limit-update__text">
        {{ getContent(popupsData, defaultLocalePopupsData, 'selfExclusionConfirm.updateDescription') }}
      </div>

      <div class="modal-confirm-limit-update__actions">
        <button-base type="primary" size="md" @click="save">
          {{ getContent(popupsData, defaultLocalePopupsData, 'selfExclusionConfirm.okButtonLabel') }}
        </button-base>
        <button-base type="secondary" size="md" @click="cancel">
          {{ getContent(popupsData, defaultLocalePopupsData, 'selfExclusionConfirm.cancelButtonLabel') }}
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

<style src="~/assets/styles/components/modal/confirm-limit-update.scss" lang="scss" />
