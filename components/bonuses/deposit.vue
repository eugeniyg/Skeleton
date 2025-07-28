<template>
  <div class="bonuses-deposit bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'depositTitle') }}
      <div v-if="depositBonusesCount" class="bonuses-grid__title-count">({{ depositBonusesCount }})</div>
    </div>

    <bonuses-package
      v-for="packageList in props.packageBonuses"
      :key="packageList[0].package?.id"
      :list="packageList"
      :loading="props.loadingBonuses.includes(packageList[0].id)"
      @activate="emit('activateDeposit', { depositBonus: packageList[0] })"
      @open-package-modal="emit('openPackageModal', packageList)"
    />

    <bonuses-card
      v-for="depositBonus in simpleDepositBonusesList"
      :key="depositBonus.id"
      :bonus-info="depositBonus"
      :loading="props.loadingBonuses.includes(depositBonus.id)"
      is-deposit
      @activate="emit('activateDeposit', { depositBonus })"
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
  const emit = defineEmits(['activateDeposit', 'openPackageModal']);

  const bonusStore = useBonusStore();
  const { depositBonuses } = storeToRefs(bonusStore);
  const simpleDepositBonusesList = computed(() => depositBonuses.value.filter(bonus => !bonus.package?.id));
  const depositBonusesCount = computed(() => simpleDepositBonusesList.value.length + props.packageBonuses.length);
</script>
