<template>
  <vue-final-modal
    :model-value="props.showModal"
    class="modal-restricted-bets"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @before-open="getPlayerBonuses"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')" />
      </div>

      <atomic-image class="img" :src="props.content.image" />

      <div class="title">{{ props.content.title }}</div>

      <p class="text">{{ props.content.description }}</p>

      <atomic-bonus-progress
        v-if="activePlayerBonuses[0]"
        :wagering-label="props.content.wageringLabel"
        :bonus-info="activePlayerBonuses[0]"
      />

      <div class="actions">
        <button-base type="primary" size="md" @click="handleConfirm">
          {{ props.content.confirmButton }}
        </button-base>

        <button-base type="ghost" size="xs" @click="handleCancel">
          {{ props.content.cancelButton }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IRestrictedBetsModal } from '~/types';

  const props = defineProps<{
    showModal: boolean;
    currentPage: 'betting' | 'game';
    content: IRestrictedBetsModal;
  }>();

  const emit = defineEmits(['closeModal']);
  const { localizePath } = useProjectMethods();
  const router = useRouter();

  const bonusStore = useBonusStore();
  const { getPlayerBonuses } = bonusStore;
  const { activePlayerBonuses } = storeToRefs(bonusStore);

  watch(activePlayerBonuses, newValue => {
    if (!newValue && props.showModal) emit('closeModal');
  });

  const handleConfirm = (): void => {
    router.push(localizePath(props.currentPage === 'betting' ? '/main' : '/betting'));
  };

  const handleCancel = (): void => {
    router.push(localizePath('/profile/bonuses'));
  };
</script>

<style src="~/assets/styles/components/modal/restricted-bets.scss" lang="scss" />
