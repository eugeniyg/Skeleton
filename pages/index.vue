<template>
  <div class="home">
    <cards-group v-bind="benCards">
      <template v-slot:card="item">
        <card-benefit v-bind="item"/>
      </template>
    </cards-group>

    <div class="categories">
      <card-category v-for="(item, itemIndex) in categories" :key="itemIndex" v-bind="item"/>
    </div>

    <cards-group v-bind="promoCards">
      <template v-slot:card="item">
        <card-promotions v-bind="item"/>
      </template>
    </cards-group>
  </div>
</template>

<script setup lang="ts">
  const { categories, benefitsCards, promotionCards } = useFakeStore();
  const benCards = benefitsCards();
  const promoCards = promotionCards();
</script>
