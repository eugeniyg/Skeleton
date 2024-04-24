<template>
  <vue-final-modal
    v-model="props.showModal"
    class="modal-restricted-bets"
    :clickToClose="false"
    @beforeOpen="getPlayerBonuses"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')" />
      </div>
      
      <atomic-image class="img" :src="props.content.image" />
      
      <div class="title">{{ props.content.title }}</div>

      <p class="text">{{ props.content.description }}</p>

      <atomic-bonus-progress
        :wageringLabel="props.content.wageringLabel"
        :bonusInfo="currentActiveBonus"
      />
      
      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="handleConfirm"
        >
          {{ props.content.confirmButton }}
        </button-base>
        
        <button-base
          type="ghost"
          size="xs"
          @click="handleCancel"
        >
          {{ props.content.cancelButton }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import  { storeToRefs } from "pinia";
  import type { IRestrictedBetsModal } from "~/types";

  const props = defineProps<{
    showModal: boolean;
    currentPage: 'betting'|'game';
    content: IRestrictedBetsModal;
  }>();

  const emit = defineEmits(['closeModal']);
  const { localizePath } = useProjectMethods();
  const router = useRouter();

  const bonusStore = useBonusStore();
  const { getPlayerBonuses } = bonusStore;
  const { currentActiveBonus } = storeToRefs(bonusStore);

  watch(currentActiveBonus, (newValue) => {
    if (!newValue && props.showModal) emit('closeModal');
  })

  const handleConfirm = (): void => {
    router.push(localizePath(props.currentPage === 'betting' ? '/main' : '/betting'));
  }

  const handleCancel = (): void => {
    router.push(localizePath('/profile/bonuses'));
  }
</script>

<style src="~/assets/styles/components/modal/restricted-bets.scss" lang="scss" />

