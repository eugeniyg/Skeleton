<template>
  <div>
    <atomic-filters class="filters-bonuses-history">
      <form-dropdown-base
        label="Currency:"
        value=""
        name="currency-select"
        placeholder="All"
        :options="selects.currency"
      />

      <form-dropdown-base
        label="Status:"
        value=""
        name="status-select"
        placeholder="All"
        :options="selects.statuses"
      />
      <form-input-date label="Date:"/>
    </atomic-filters>
    <table-bonuses-history :items="bonusesHistoryTb"/>
  </div>
</template>

<script setup lang="ts">
  const { bonusesHistoryTb, selects } = useFakeStore();
</script>

<style lang="scss" src="./style.scss"/>
