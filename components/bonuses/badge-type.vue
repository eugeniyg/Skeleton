<template>
  <div class="bonuses-badge-type" :class="`is-${typeContent?.color || 'cashback'}`">
    <atomic-icon :id="typeContent?.icon || 'cashback'" class="bonuses-badge-type__icon" />
    <span class="bonuses-badge-type__label">{{ typeContent?.label || props.mode }}</span>
  </div>
</template>

<script setup lang="ts">
  import type {IProfileBonuses} from "~/types";

  const props = defineProps<{
    mode: number;
  }>();

  const modeMap: Record<number, string> = {
    '-1': 'package',
    '1': 'cash',
    '2': 'percentage',
    '3': 'freeSpin',
    '4': 'cashback'
  }

  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));
  const typeContent = computed(() => getContent(bonusesContent.value, defaultLocaleBonusesContent.value, `types.${modeMap[props.mode]}`));
</script>

<style src="~/assets/styles/components/bonuses/badge-type.scss" lang="scss"/>