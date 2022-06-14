<template>
  <div>
    <filters class="filters-transactions-history">
      <form-input-date label="Date from / to:" :settings="settings"/>

      <form-dropdown
        label="Type:"
        name="type-select"
        placeholder="All"
        :options="selects.types"
      />

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
    </filters>

    <table-transactions-history :items="transactionsHistoryTb"/>
  </div>
</template>

<script setup lang="ts">
  const { transactionsHistoryTb, selects } = useFakeStore();
  const settings = {
    config: {
      // wrap: true, // set wrap to true only when using 'input-group'
      // altFormat: 'M j, Y',
      altInput: true,
      dateFormat: 'Y-m-d',
      mode: 'range',
      monthSelectorType: 'static',
    },
  };
</script>

<style lang="scss" src="./style.scss"/>
