<template>
  <div>
    <filters class="filters-bonuses-history">
      <form-dropdown
        label="Currency:"
        name="currency-select"
        placeholder="All"
        :options="selects.currency"
      />

      <form-dropdown
        label="Status:"
        name="status-select"
        placeholder="All"
        :options="selects.statuses"
      />
      <form-input-date label="Date:"/>
    </filters>
    <table-bonuses-history :items="bonusesHistoryTb"/>
  </div>
</template>

<script setup lang="ts">
  const { bonusesHistoryTb, selects } = useFakeStore();
</script>

<style lang="scss" src="./style.scss"/>
