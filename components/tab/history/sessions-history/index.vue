<template>
  <table-sessions-history :items="sessionHistoryTb"/>
</template>

<script setup lang="ts">
  const { sessionHistoryTb } = useFakeStore();
</script>

<style lang="scss" src="./style.scss"/>
