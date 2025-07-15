<template>
  <div class="bonuses-issued bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'issuedTitle') }}
      <div v-if="issuedBonuses" class="bonuses-grid__title-count">({{ issuedBonuses }})</div>
    </div>

    <bonuses-package
      v-for="packageList in props.packageBonuses"
      :key="packageList[0].issueSessionId ?? packageList[0].packageId"
      :list="packageList"
      :loading="isPackageLoading(packageList)"
      @activate="activatePackage(packageList)"
      @open-package-modal="emit('openPackageModal', packageList)"
    />

    <bonuses-card
      v-for="bonus in simpleBonusesList"
      :key="bonus.id"
      :bonus-info="bonus"
      :loading="props.loadingBonuses.includes(bonus.id)"
      is-cash
      @remove="emit('removeBonus', bonus)"
      @activate="emit('activateBonus', bonus)"
    />

    <bonuses-card
      v-for="freeSpin in simpleFreeSpinsList"
      :key="freeSpin.id"
      :bonus-info="freeSpin"
      :loading="props.loadingBonuses.includes(freeSpin.id)"
      is-free-spin
      @remove="emit('removeFreeSpin', freeSpin)"
      @activate="emit('activateFreeSpin', freeSpin)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from '~/types';

  const props = defineProps<{
    loadingBonuses: string[];
    packageBonuses: Record<string, any>[][];
  }>();

  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));
  const emit = defineEmits(['activateBonus', 'activateFreeSpin', 'removeBonus', 'removeFreeSpin', 'openPackageModal']);

  const bonusStore = useBonusStore();
  const { issuedPlayerBonuses, issuedPlayerFreeSpins } = storeToRefs(bonusStore);

  const simpleBonusesList = computed(() => issuedPlayerBonuses.value.filter(bonus => !bonus.packageId));
  const simpleFreeSpinsList = computed(() => issuedPlayerFreeSpins.value.filter(freeSpin => !freeSpin.packageId));
  const issuedBonuses = computed(() => {
    return simpleBonusesList.value.length + simpleFreeSpinsList.value.length + props.packageBonuses.length;
  });

  const isPackageLoading = (packageList: Record<string, any>[]): boolean => {
    const firstAvailableBonus = packageList.find(bonus => bonus.status === 1);
    return props.loadingBonuses.includes(firstAvailableBonus?.id);
  };

  const activatePackage = (packageList: Record<string, any>[]): void => {
    const firstAvailableBonus = packageList.find(bonus => bonus.status === 1);

    if (firstAvailableBonus?.isFreeSpin) emit('activateFreeSpin', firstAvailableBonus);
    else if (firstAvailableBonus) emit('activateBonus', firstAvailableBonus);
  };
</script>
