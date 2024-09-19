<template>
  <div class="bonuses-active bonuses-grid">
    <div class="bonuses-grid__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'activeTitle') }}
    </div>

    <bonuses-package
      v-for="(packageList, index) in props.packageBonuses"
      :key="packageList[0].packageId"
      :packageImage="packageImages[index % (packageImages.length || 1)]"
      :list="packageList"
      @openPackageModal="emit('openPackageModal', packageList)"
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

  const props = defineProps<{
    packageBonuses: Record<string, any>[][];
  }>();

  const emit = defineEmits(['removeBonus', 'removeFreeSpin', 'openPackageModal']);
  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const packageImages = computed(() => {
    const contentImages: { image: string }[]|undefined = getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'bonuses.packageImages'
    );
    if (contentImages?.length) return contentImages.map(imageObject => imageObject.image);
    return [];
  })

  const bonusStore = useBonusStore();
  const {
    activePlayerBonuses,
    activePlayerFreeSpins
  } = storeToRefs(bonusStore);

  const simpleBonusesList = computed(() => activePlayerBonuses.value.filter(bonus => !bonus.packageId));
  const simpleFreeSpinsList = computed(() => activePlayerFreeSpins.value.filter(freeSpin => !freeSpin.packageId));
</script>