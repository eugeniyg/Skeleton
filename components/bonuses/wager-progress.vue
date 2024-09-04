<template>
  <div class="bonuses-wager-progress">
    <div class="bonuses-wager-progress__row">
      <template v-if="props.bonusInfo.wagerCasino">
        <atomic-icon id="cherry" class="bonuses-wager-progress__icon"/>
        <span class="bonuses-wager-progress__label">
          {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'wager') }}
        </span>
        <span class="bonuses-wager-progress__value">(x{{ props.bonusInfo.wagerCasino }}):</span>
        <span class="bonuses-wager-progress__amount">{{ props.bonusInfo.currentWagerCasinoAmount }}</span>
        <span class="bonuses-wager-progress__divider">/</span>
        <span class="bonuses-wager-progress__amount">{{  }}</span>


      </template>

      <atomic-icon :id="icon" class="bonuses-wager-progress__icon"/>
      <span class="bonuses-wager-progress__label">Wager</span>
      <span v-if="props.wager" class="bonuses-wager-progress__value">(x{{ props.wager }}):</span>
      <span v-if="props.amountFrom" class="bonuses-wager-progress__amount">{{ props.amountFrom }}</span>
      <template v-if="props.amountTo">
        <span class="bonuses-wager-progress__divider">/</span>
        <span class="bonuses-wager-progress__amount">{{ props.amountTo }}</span>
      </template>
      <span v-if="currency" class="bonuses-wager-progress__currency">{{ props.currency }}</span>
    </div>

    <bonuses-progress v-if="props.progress" :value="props.progress"/>
    <bonuses-waiting-results/>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerBonus } from "@skeleton/core/types";
  import type {IProfileBonuses} from "~/types";

  const props = defineProps<{
    bonusInfo: IPlayerBonus;
  }>();

  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const iconMap = {
    sportsbook: 'sportsbook-football',
    casino: 'cherry',
  }

  const icon = computed(() => iconMap[props.category]);
</script>

<style src="~/assets/styles/components/bonuses/wager.scss" lang="scss"/>