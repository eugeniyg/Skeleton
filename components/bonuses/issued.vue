<template>
  <div class="bonuses-issued bonuses-grid">
    <atomic-divider />

    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'issuedTitle') }}
      <div v-if="issuedBonuses" class="bonuses-grid__title-count">({{ issuedBonuses }})</div>
    </div>

    <bonuses-card
      v-for="bonus in issuedPlayerBonuses"
      :key="bonus.id"
      :bonusInfo="bonus"
      isCash
    />

    <bonuses-card
      v-for="freeSpin in issuedPlayerFreeSpins"
      :key="freeSpin.id"
      :bonusInfo="freeSpin"
      isFreeSpin
    />

    <bonuses-card
      v-for="depositBonus in depositBonuses"
      :key="depositBonus.id"
      :bonusInfo="depositBonus"
      isDeposit
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from "~/types";

  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const bonusStore = useBonusStore();
  const {
    issuedPlayerBonuses,
    issuedPlayerFreeSpins,
    depositBonuses
  } = storeToRefs(bonusStore);
  
  const issuedBonuses = computed(() => issuedPlayerBonuses.value.length 
    + issuedPlayerFreeSpins.value.length 
    + depositBonuses.value.length
  );
</script>