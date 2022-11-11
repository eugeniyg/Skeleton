<template>
  <div data-tooltip-parent>
    <atomic-empty variant="bonuses" sub-title="You have not received bonuses yet."/>

    <div class="cards-bonuses">
      <div class="card-bonus-code">
        <h4 class="card-bonus-code__title">Have a promocode?</h4>

        <atomic-bonus-code-timer/>

        <form-bonus-code
          v-if="hasBonusCode"
          v-model:value="bonusValue"
        />
      </div>

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
  const hasBonusCode = ref<boolean>(true);
  const bonusValue = ref<string>('');
</script>

<style lang="scss">
.card-bonus-code {
  padding: rem(24px) rem(18px);
  background-color: var(--gray-900);
  border-radius: 16px;
  user-select: none;

  &__title {
    @include font($heading-4);
    color: var(--white);
    margin: 0 0 rem(24px);
    text-align: center;
  }
}
</style>
