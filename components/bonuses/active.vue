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
      @remove="emit('removeBonus', bonus)"
    />

    <bonuses-card
      v-for="freeSpin in activePlayerFreeSpins"
      :key="freeSpin.id"
      :bonusInfo="freeSpin"
      isFreeSpin
      @remove="emit('removeFreeSpin', freeSpin)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from "~/types";

  const emit = defineEmits(['removeBonus', 'removeFreeSpin']);
  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const bonusStore = useBonusStore();
  const {
    activePlayerBonuses,
    activePlayerFreeSpins
  } = storeToRefs(bonusStore);
</script>