<template>
  <div v-if="minDeposit" class="bonuses-min-deposit">
    <div class="bonuses-min-deposit__row">
      <span v-if="props.label" class="bonuses-min-deposit__label">{{ props.label }}:</span>
      <span class="bonuses-min-deposit__amount">{{ minDeposit.amount }}</span>
      <span class="bonuses-min-deposit__currency">{{ minDeposit.currency }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus } from "@skeleton/core/types";

  const props = defineProps<{
    bonusInfo: IBonus;
    label?: string;
  }>();

  const { getMinBonusDeposit } = useProjectMethods();
  const minDeposit = computed(() => getMinBonusDeposit(props.bonusInfo));
</script>

<style src="~/assets/styles/components/bonuses/min-deposit.scss" lang="scss"/>