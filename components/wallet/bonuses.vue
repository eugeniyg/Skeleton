<template>
  <div class="wallet-bonuses">
    <atomic-divider/>
    <div class="wallet-bonuses__title">Chose a bonus</div>
    <template v-for="(bonus, index) in bonusesList" :key="index">
      <wallet-bonus v-bind="bonus" :selected="index === 0"/>
    </template>
    <atomic-divider />
  </div>
</template>

<script setup lang="ts">
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
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      id: 5
    },
  ]
</script>

<style src="~/assets/styles/components/wallet/bonuses.scss" lang="scss"/>