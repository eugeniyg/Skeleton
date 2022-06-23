<template>
  <div>
    <!--<atomic-filters class="filters-transactions-history">
      <form-input-date label="Date from / to:" :settings="settings"/>

      <form-dropdown-base
        label="Type:"
        value=""
        name="type-select"
        placeholder="All"
        :options="selects.types"
      />

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
    </atomic-filters>

    <table-transactions-history :items="transactionsHistoryTb"/>-->
    <atomic-empty variant="transactions" sub-title="You don’t have any successful transactions yet."/>
  </div>
</template>

<script setup lang="ts">
  // const { transactionsHistoryTb, selects } = useFakeStore();
  // const settings = {
  //   config: {
  //     // wrap: true, // set wrap to true only when using 'input-group'
  //     // altFormat: 'M j, Y',
  //     altInput: true,
  //     dateFormat: 'Y-m-d',
  //     mode: 'range',
  //     monthSelectorType: 'static',
  //   },
  // };
</script>

<style lang="scss" src="./style.scss"/>
