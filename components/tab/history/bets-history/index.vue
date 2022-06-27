<template>
  <div>
    <!--<nav-bets-history @select="selected = $event" :selected="selected"/>
    <table-bets-history :items="tbItems"/>-->
    <atomic-empty variant="bets-history" sub-title="You have not placed any bets yet."/>
  </div>
</template>

<script setup lang="ts">
  // const selected = ref<string>('casino');
  // const { betsHistoryTbCasinoItems, betsHistoryTbBettingItems } = useFakeStore();
  //
  // const tbItems = computed(() => (selected.value === 'casino' ? betsHistoryTbCasinoItems() : betsHistoryTbBettingItems()));
</script>

<style lang="scss" src="./style.scss"/>
