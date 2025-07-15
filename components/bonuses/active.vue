<template>
  <div class="bonuses-active bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'activeTitle') }}
    </div>

    <bonuses-package
      v-for="packageList in props.packageBonuses"
      :key="packageList[0].issueSessionId ?? packageList[0].packageId"
      :list="packageList"
      @open-package-modal="emit('openPackageModal', packageList)"
    />

    <bonuses-card
      v-for="bonus in simpleBonusesList"
      :key="bonus.id"
      :bonus-info="bonus"
      is-cash
      @remove="emit('removeBonus', bonus)"
    />

    <bonuses-card
      v-for="freeSpin in simpleFreeSpinsList"
      :key="freeSpin.id"
      :bonus-info="freeSpin"
      is-free-spin
      @remove="emit('removeFreeSpin', freeSpin)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from '~/types';

  const props = defineProps<{
    packageBonuses: Record<string, any>[][];
  }>();

  const emit = defineEmits(['removeBonus', 'removeFreeSpin', 'openPackageModal']);
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));
  const bonusStore = useBonusStore();
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);

  const simpleBonusesList = computed(() => activePlayerBonuses.value.filter(bonus => !bonus.packageId));
  const simpleFreeSpinsList = computed(() => activePlayerFreeSpins.value.filter(freeSpin => !freeSpin.packageId));
</script>
