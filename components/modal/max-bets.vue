<template>
  <vue-final-modal
    :modelValue="props.showModal"
    class="modal-max-bets"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')" />
      </div>
      
      <atomic-image class="img" :src="getContent(popupsData, defaultLocalePopupsData, 'maxBets.image')" />
      
      <div class="title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'maxBets.title') }}
      </div>

      <p class="text">
        {{ getContent(popupsData, defaultLocalePopupsData, 'maxBets.description') }}
      </p>

      <div class="modal-max-bets__info">
        <atomic-icon id="warning" />

        <span class="modal-max-bets__info-label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'maxBets.maxBetLabel') }}:
        </span>

        <span class="modal-max-bets__info-value">
          {{ props.maxBet }}
        </span>
      </div>
      
      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="emit('closeModal')"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'maxBets.confirmButton') }}
        </button-base>
        
        <button-base
          type="ghost"
          size="xs"
          @click="handleCancel"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'maxBets.cancelButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import  { storeToRefs } from "pinia";

  const props = defineProps<{
    showModal: boolean;
    maxBet: string;
  }>();

  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const emit = defineEmits(['closeModal']);
  const { localizePath, getContent } = useProjectMethods();
  const router = useRouter();

  const handleCancel = (): void => {
    emit('closeModal');
    setTimeout(() => {
      router.push(localizePath('/profile/bonuses'));
    }, 500);
  }
</script>

<style src="~/assets/styles/components/modal/max-bets.scss" lang="scss" />

