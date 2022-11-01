<template>
  <div data-tooltip-parent>
    <a class="link-bonus" href="#">See your bonuses history</a>
    <!--<atomic-empty variant="bonuses" sub-title="You have not received bonuses yet."/>-->
    <div class="cards-bonuses">
      <h4 class="cards-bonuses__title">Cash bonuses</h4>

      <card-bonuses v-for="item in cashBonuses" :key="item" v-bind="item"/>

    </div>

    <div class="cards-bonuses">
      <h4 class="cards-bonuses__title">Free spins</h4>

      <card-bonuses v-for="item in cashBonuses" :key="item" v-bind="item"/>
    </div>

    <button @click="showModal('confirmBonus')">confirm bonus</button>
  </div>
</template>

<script setup lang="ts">
  const { cashBonuses } = useFakeStore();
  const { showModal } = useLayoutStore();
</script>
