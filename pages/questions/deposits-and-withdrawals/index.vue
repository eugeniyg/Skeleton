<template>
  <div class="content">
    <h1 class="heading">Deposits & Withdrawals</h1>
    <expander :items="accordeons.depositsAndWithdrawals"/>
  </div>
</template>

<script setup lang="ts">
  const { accordeons } = useFakeStore();
</script>
