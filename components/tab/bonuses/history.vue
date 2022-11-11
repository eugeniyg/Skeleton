<template>
  <div class="cards-bonuses" data-tooltip-parent>
    <h4 class="cards-bonuses__title">Free spins</h4>

    <card-bonuses v-for="item in cashBonuses" :key="item" v-bind="item"/>
  </div>
</template>

<script setup lang="ts">
  const { cashBonuses } = useFakeStore();
</script>

<style lang="scss">
.card-bonuses {
  .input-toggle {
    display: none;
  }
}
</style>
