<template>
  <div class="bonuses-issued bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'issuedTitle') }}
      <div v-if="issuedBonuses" class="bonuses-grid__title-count">({{ issuedBonuses }})</div>
    </div>

    <bonuses-package
      v-for="packageList in props.packageBonuses"
      :key="packageList[0].packageId"
      :list="packageList"
      @openPackageModal="emit('openPackageModal', packageList)"
    />

    <bonuses-card
      v-for="bonus in simpleBonusesList"
      :key="bonus.id"
      :bonusInfo="bonus"
      :loading="props.loadingBonuses.includes(bonus.id)"
      isCash
      @remove="emit('removeBonus', bonus)"
      @activate="emit('activateBonus', bonus)"
    />

    <bonuses-card
      v-for="freeSpin in simpleFreeSpinsList"
      :key="freeSpin.id"
      :bonusInfo="freeSpin"
      :loading="props.loadingBonuses.includes(freeSpin.id)"
      isFreeSpin
      @remove="emit('removeFreeSpin', freeSpin)"
      @activate="emit('activateFreeSpin', freeSpin)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from "~/types";

  const props = defineProps<{
    loadingBonuses: string[];
    packageBonuses: Record<string, any>[][];
  }>();

  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));
  const emit = defineEmits([
    'activateBonus',
    'activateFreeSpin',
    'removeBonus',
    'removeFreeSpin',
    'openPackageModal'
  ]);

  const bonusStore = useBonusStore();
  const {
    issuedPlayerBonuses,
    issuedPlayerFreeSpins
  } = storeToRefs(bonusStore);

  const simpleBonusesList = computed(() => issuedPlayerBonuses.value.filter(bonus => !bonus.packageId));
  const simpleFreeSpinsList = computed(() => issuedPlayerFreeSpins.value.filter(freeSpin => !freeSpin.packageId));
  const issuedBonuses = computed(() => {
    return simpleBonusesList.value.length + simpleFreeSpinsList.value.length + props.packageBonuses.length;
  });
</script>