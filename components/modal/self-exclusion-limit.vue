<template>
  <vue-final-modal
    class="modal-self-exclusion-limit"
    :click-to-close="true"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('self-exclusion-limit')" />
        <div class="title">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'updateTitle') }}
        </div>
      </div>

      <div class="modal-self-exclusion-limit__text">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'updateDescription') }}
      </div>

      <div class="modal-self-exclusion-limit__actions">
        <button-base type="primary" size="md" @click="save">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'okButtonLabel') }}
        </button-base>
        <button-base type="secondary" size="md" @click="cancel">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButtonLabel') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    period?: string;
    currentLocaleData: Maybe<IModalsContent['selfExclusionLimit']>;
    defaultLocaleData: Maybe<IModalsContent['selfExclusionLimit']>;
  }>();

  const limitsStore = useLimitsStore();
  const { createLimit } = limitsStore;
  const { closeModal } = useModalStore();
  const { logOutUser } = useProfileStore();

  const save = async () => {
    await closeModal('self-exclusion-limit');
    await createLimit({
      definition: 4,
      period: props.period,
    });
    await logOutUser();
  };

  const cancel = () => {
    closeModal('self-exclusion-limit');
  };
</script>

<style src="~/assets/styles/components/modal/self-exclusion-limit.scss" lang="scss" />
