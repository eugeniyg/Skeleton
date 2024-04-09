<template>
  <vue-final-modal
    v-model="modals.confirm"
    class="modal-restricted-bets"
    :clickToClose="false"
    @beforeOpen="getPlayerBonuses"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')" />
      </div>
      
      <atomic-image class="img" :src="content.image" />
      
      <div class="title">{{ title }}</div>

      <p class="text">{{ description }}</p>

      <atomic-bonus-progress
        v-if="currentActiveBonus"
        :wageringLabel="content.wageringLabel"
        :bonusInfo="currentActiveBonus"
      />
      
      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="emit('confirm')"
        >
          {{ content.confirmButton }}
        </button-base>
        
        <button-base
          type="ghost"
          size="xs"
          @click="emit('cancel')"
        >
          {{ content.cancelButton }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import  { storeToRefs } from "pinia";
  import type { IRestrictedBetsModal } from "~/types";

  const emit = defineEmits(['cancel', 'confirm', 'closeModal']);

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const content: IRestrictedBetsModal = getContent(popupsData, defaultLocalePopupsData, 'restrictedBets');

  const route = useRoute();
  const routeName = route.name as string;
  const title = computed(() => routeName.includes('sportsbook') ? content.titleSportsbook : content.titleCasino);
  const description = computed(() => routeName.includes('sportsbook') ? content.descriptionSportsbook : content.descriptionCasino);

  const bonusStore = useBonusStore();
  const { getPlayerBonuses } = bonusStore;
  const { currentActiveBonus } = storeToRefs(bonusStore);
</script>

<style src="~/assets/styles/components/modal/confirm-bonus-unsettled.scss" lang="scss" />

