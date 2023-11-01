<template>
  <div class="wallet-bonuses">
    <atomic-divider/>

    <div class="wallet-bonuses__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.title') }}
    </div>

    <template v-for="(bonus, index) in bonusesList" :key="index">
      <wallet-bonus
        v-bind="bonus"
        :selected="selectedBonus === bonus.id"
        @bonusChange="onBonusChange"
      />
    </template>

    <div v-if="props.crypto" class="wallet-bonuses__info">
      <div class="wallet-bonuses__info-icon">
        <atomic-icon id="info"/>
      </div>

      <div class="wallet-bonuses__info-description">
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.infoDescription') }}
      </div>
    </div>

    <atomic-divider />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    crypto?: boolean;
  }>();

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const selectedBonus = ref<number>(1);

  const onBonusChange = (bonusId: number): void => {
    if (selectedBonus.value === bonusId) selectedBonus.value = -1;
    else selectedBonus.value = bonusId;
  }

  const bonusesList = [
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      id: 1,
      background: 'red',
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      id: 2,
      background: 'orange'
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      id: 3,
      background: 'green'
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      id: 4,
      background: 'violet'
    }
  ]
</script>

<style src="~/assets/styles/components/wallet/bonuses.scss" lang="scss"/>