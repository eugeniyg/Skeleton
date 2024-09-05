<template>
  <div class="bonuses-active bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'activeTitle') }}
    </div>

    <bonuses-card
      v-for="bonus in activePlayerBonuses"
      :key="bonus.id"
      :bonusInfo="bonus"
      isCash
    />

    <bonuses-card
      v-for="freeSpin in activePlayerFreeSpins"
      :key="freeSpin.id"
      :bonusInfo="freeSpin"
      isFreeSpin
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
    activePlayerBonuses,
    activePlayerFreeSpins
  } = storeToRefs(bonusStore);
</script>