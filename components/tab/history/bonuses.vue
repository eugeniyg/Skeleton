<template>
  <div>
    <!--<atomic-filters class="filters-bonuses-history">
      <form-input-dropdown
        label="Currency:"
        value=""
        name="currency-select"
        placeholder="All"
        :options="selects.currency"
      />

      <form-input-dropdown
        label="Status:"
        value=""
        name="status-select"
        placeholder="All"
        :options="selects.statuses"
      />
      <form-input-date label="Date:"/>
    </atomic-filters>
    <table-bonuses-history :items="bonusesHistoryTb"/>-->
    <atomic-empty variant="bonuses" sub-title="You have not received bonuses yet."/>
  </div>
</template>

<script setup lang="ts">
  // const { bonusesHistoryTb, selects } = useFakeStore();
</script>

<style lang="scss">
.tb-bonuses-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  padding-bottom: rem(8px);

  .row {
    grid-template-columns:
      minmax(rem(156px), 1fr)
      minmax(rem(105px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(75px), 1fr)
      minmax(rem(100px), 1fr)
      minmax(rem(100px), 1fr);
  }
}
</style>
