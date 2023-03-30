<template>
  <div class="bonus-active" data-tooltip-parent>
    <h4 class="bonus-active__title">Cash bonuses</h4>

    <template v-if="cashBonuses.length">
      <div class="bonus-active__list">
        <card-bonuses v-for="item in cashBonuses" :key="item" v-bind="item"/>
      </div>
    </template>

    <atomic-empty
      v-else
      variant="bonuses"
      title="There is no data yet!"
      sub-title="You currently do not have any bonuses"
    />
  </div>
</template>

<script setup lang="ts">
  const cashBonuses = [];
</script>

<style lang="scss">
.bonus-active {
  margin-top: 16px;

  &__title {
    @include font($heading-5);
    color: var(--white);
    margin: 0 0 rem(24px);
  }

  &__list {
    display: grid;
    grid-gap: 16px;

    @include media(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include media(xl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include media(xl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include media(xxxl) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .empty {
  }
}
</style>
