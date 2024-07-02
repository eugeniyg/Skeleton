<template>
  <div class="quest-currency" v-if="rewardsValue.length">
    <div class="quest-currency__item">
      <div class="quest-currency__label">{{ rewardsValue[0].amount }}</div>
      <div class="quest-currency__value">{{ rewardsValue[0].currency }}</div>

      <atomic-image
        class="quest-currency__symbol"
        :src="`/img/currency/${rewardsValue[0].isoCode}.svg`"
        defaultImage="/img/currency/placeholder.svg"
      />
    </div>

    <div
      v-if="rewardsValue.length > 1"
      class="quest-currency__more"
      @click="showRewardsModal"
    >
      <span>+</span>
      <span>{{ rewardsValue.length - 1 }}</span>
      <span class="quest-currency__more-label">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.moreLabel') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPlayerQuestReward } from "@skeleton/core/types";

const props = defineProps<{
  rewards: IPlayerQuestReward[];
  type: 'real'|'virtual';
}>();

const emit = defineEmits();
const { currencies, defaultLocalePopupsData, popupsData } = useGlobalStore();

const filteredRewards = props.rewards.filter(reward => {
  const rewardCurrencyType = currencies.find(currency => currency.code === reward.attributes.isoCode);
  if (props.type === 'virtual') return rewardCurrencyType?.type === 'virtual';
  return rewardCurrencyType?.type !== 'virtual';
});

const { formatBalance, getContent } = useProjectMethods();
const walletStore = useWalletStore();
const { activeAccount } = storeToRefs(walletStore);
const rewardsValue = computed(() => {
  const rewardsArr: { currency: string, amount: number, isoCode: string }[] = [];
  for (const reward of filteredRewards) {
    const formatSumObj = formatBalance(reward.attributes.isoCode, reward.amount);
    const combineAwardsValue = { ...formatSumObj, isoCode: reward.attributes.isoCode };
    if (reward.attributes.isoCode === activeAccount.value?.currency) rewardsArr.unshift(combineAwardsValue);
    else rewardsArr.push(combineAwardsValue);
  }
  return rewardsArr;
});

const { openRewardsModal } = useQuestsStore();
const rewardsModalTitle = computed(() => {
  return getContent(popupsData, defaultLocalePopupsData, 'questsHub.rewardsTitle');
})
const showRewardsModal = ():void => {
  openRewardsModal(rewardsValue.value, rewardsModalTitle.value);
}
</script>

<style src="~/assets/styles/components/quest/currency.scss" lang="scss"/>