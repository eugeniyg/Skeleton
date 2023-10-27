<template>
  <div class="cash-bonuses">
    <atomic-divider/>
    <div class="cash-bonuses__title">Chose a bonus</div>
    <template v-for="(bonus, index) in bonusesList" :key="index">
      <cash-bonus v-bind="bonus" :selected="index === 0"/>
    </template>
    <atomic-divider />
  </div>
</template>

<script setup lang="ts">
  const bonusesList = [
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      background: 'red',
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      background: 'orange'
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      background: 'green'
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
      min: '$10',
      background: 'violet'
    },
    {
      title: 'Take your 50% bonus up to 1 BTC <br> and 50 FS.',
    },
  ]
</script>

<style src="~/assets/styles/components/cash/bonuses.scss" lang="scss"/>