<template>
  <div class="home">
    <div class="promo-card-wrapper">
      <card-promo v-bind="mainBanner"/>
    </div>
    <cards-group v-bind="benCards">
      <template v-slot:card="item">
        <card-benefit v-bind="item"/>
      </template>
    </cards-group>

    <div class="categories">
      <card-category v-for="(item, itemIndex) in categories" :key="itemIndex" v-bind="item"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { categories, benefitsCards, mainBanner } = useFakeStore();
  const benCards = benefitsCards();
</script>
