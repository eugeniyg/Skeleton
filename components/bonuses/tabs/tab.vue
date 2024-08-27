<template>
  <div class="bonuses-tabs-tab">
    <div class="bonuses-tabs-tab__content">
      <div class="bonuses-tabs-tab__content-row" v-for="[labelId, label] in modalLabels" :key="labelId">
        <div class="bonuses-tabs-tab__content-label">{{ label }}</div>
        <div class="bonuses-tabs-tab__content-value">{{ formatValue(itemsData[labelId]) }}</div>
      </div>
    </div>
    
    <div class="bonuses-tabs-tab__footer">
      <p>* Wager in in-House Games is accrued with a coefficient 0.2</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  
  const itemsData: any = {
      minDeposit: '$10',
      maxDeposit: '$200',
      bonusType: 'Fixed',
      casinoWager: 'x35',
      MaxWinSum: '100%, max. $100',
      minBetForWager: '$0.1',
      maxBetForWager: '$10',
      provider: 'Turbo Games',
      games: ['Limbo Rider', 'Save The Princess', 'Fruit Towers', 'Double Roll', 'Magic Keno', 'Crash X', 'Ball & Ball', 'Stairs', 'Neko'],
      betAmount: 'FreeSpin',
      sticky: true,
      cashAble: false,
    };
  
  const modalLabels = computed(() => {
    const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'bonusInfo.labels');
    if (contentTabs) return Object.entries(contentTabs);
    return [];
  });
  
  const { getContent } = useProjectMethods();
  
  const formatValue = (value: string|string[]) => {
    return Array.isArray(value) ? value.join(', ') : value;
  };
</script>

<style src="~/assets/styles/components/bonuses/tabs/tab.scss" lang="scss"/>
