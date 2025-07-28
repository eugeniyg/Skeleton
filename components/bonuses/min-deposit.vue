<template>
  <div v-if="minDeposit" class="bonuses-min-deposit">
    <div class="bonuses-min-deposit__row">
      <span class="bonuses-min-deposit__label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.minDeposit') }}:
      </span>
      <span class="bonuses-min-deposit__amount">{{ minDeposit.amount }}</span>
      <span class="bonuses-min-deposit__currency">{{ minDeposit.currency }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus } from '@skeleton/api/types';
  import { getMinBonusDeposit } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    bonusInfo: IBonus;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const minDeposit = computed(() => getMinBonusDeposit(props.bonusInfo));
</script>

<style src="~/assets/styles/components/bonuses/min-deposit.scss" lang="scss" />
