<template>
  <div class="bonuses-active bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'activeTitle') }}
    </div>

    <bonuses-package
      v-for="packageBonus in packageBonusesList"
      :key="packageBonus[0].packageId"
    />

    <bonuses-card
      v-for="bonus in simpleBonusesList"
      :key="bonus.id"
      :bonusInfo="bonus"
      isCash
      @remove="emit('removeBonus', bonus)"
    />

    <bonuses-card
      v-for="freeSpin in simpleFreeSpinsList"
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

  const simpleBonusesList = computed(() => activePlayerBonuses.value.filter(bonus => !bonus.packageId));
  const simpleFreeSpinsList = computed(() => activePlayerFreeSpins.value.filter(freeSpin => !freeSpin.packageId));
  const packageBonusesList = ref<Record<string, any>[][]>([]);

  const getPackageBonuses = async (): Promise<void> => {
    const uniquePackageBonuses = [...activePlayerBonuses.value, ...activePlayerFreeSpins.value]
      .map(bonus => bonus.packageId)
      .filter((id, index, array) => array.indexOf(id) === index);
    if (!uniquePackageBonuses.length) return;

    try {
      const { getPlayerBonuses, getPlayerFreeSpins } = useCoreBonusApi();
      const [{ data: packagePlayerBonuses }, { data: packagePlayerFreeSpins }] = await Promise.all([
        getPlayerBonuses({ packageId: uniquePackageBonuses }),
        getPlayerFreeSpins({ packageId: uniquePackageBonuses })
      ]);

      packageBonusesList.value = uniquePackageBonuses.map(packageBonusId => {
        return [...packagePlayerBonuses, ...packagePlayerFreeSpins]
          .filter(bonus => bonus.packageId === packageBonusId)
          .sort((prevBonus, nextBonus) => prevBonus.packagePriority - nextBonus.packagePriority);
      });
    } catch {
      console.error('Failed to get package bonuses');
    }
  }

  onMounted(async () => {
    await getPackageBonuses();
  });
</script>