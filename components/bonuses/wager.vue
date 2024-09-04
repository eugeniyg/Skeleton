<template>
  <div class="bonuses-wager">
    <span v-if="props.label" class="bonuses-wager__label">{{ props.label }}:</span>

    <template v-if="props.bonusInfo.wagerCasino">
      <atomic-icon id="cherry" class="bonuses-wager__icon" />
      <span class="bonuses-wager__value">x{{ props.bonusInfo.wagerCasino }}</span>
    </template>

    <template v-if="props.bonusInfo.wagerSportsbook">
      <atomic-icon id="sportsbook-football" class="bonuses-wager__icon" />
      <span class="bonuses-wager__value">x{{ props.bonusInfo.wagerSportsbook }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerBonus, IBonus } from "@skeleton/core/types";

  const props = defineProps<{
    bonusInfo: IPlayerBonus|IBonus;
    label?: string;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/wager.scss" lang="scss"/>