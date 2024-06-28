<template>
  <div class="quest-hub-card">
    <div class="quest-hub-card__body">
      <div class="quest-hub-card__img">
        <atomic-image
          :src="questImages[questImages.length - (props.cardIndex % questImages.length)] || '/img/quests/default-quest-img.png'"
        />
      </div>

      <div class="quest-hub-card__title">
        <span>{{ props.questInfo.name }}</span>

        <div class="quest-hub-card__tooltip">
          <atomic-icon id="info"/>
        </div>
      </div>

      <div class="quest-hub-card__amount">
        <span class="quest-hub-card__amount-value">
          {{ rewardsValue[0].amount }}
        </span>

        <span class="quest-hub-card__amount-currency">
          {{ rewardsValue[0].currency }}
        </span>

        <span
          v-if="rewardsValue.length > 1"
          class="quest-hub-card__amount-more"
          @click="emit('openRewardsModal', rewardsValue)"
        >
          +{{ rewardsValue.length - 1 }} {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.moreLabel') }}
        </span>
      </div>

      <span class="quest-hub-card__arrow" @click="showModal('questTasks')">
        <atomic-icon id="arrow_expand-close"/>
      </span>
    </div>

    <hr class="quest-hub-card__divider">
  </div>
</template>

<script setup lang="ts">
import type { IPlayerQuest } from "@skeleton/core/types";

const props = defineProps<{
  questInfo: IPlayerQuest;
  cardIndex: number;
}>();

const emit = defineEmits(['openRewardsModal']);

const { getContent, formatBalance } = useProjectMethods();
const globalData = useGlobalStore();
const { popupsData, defaultLocalePopupsData } = storeToRefs(globalData);
const { showModal } = useLayoutStore();
const walletStore = useWalletStore();
const { activeAccount } = storeToRefs(walletStore);
const rewardsValue = computed(() => {
  const rewardsArr: { currency: string, amount: number }[] = [];
  for (const reward of props.questInfo.rewards) {
    const formatSumObj = formatBalance(reward.attributes.isoCode, reward.amount);
    if (reward.attributes.isoCode === activeAccount.value?.currency) rewardsArr.unshift(formatSumObj);
    else rewardsArr.push(formatSumObj);
  }
  return rewardsArr;
});

const questImages = computed(() => {
  const imgObjArr: { src: string }[] = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.questsImages') || [];
  return imgObjArr.map(imgObj => imgObj.src);
})
</script>

<style src="~/assets/styles/components/quest/hub-card.scss" lang="scss"/>