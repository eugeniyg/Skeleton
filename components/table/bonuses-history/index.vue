<template>
  <div>
    <div class="tb-bonuses-history">
      <div class="row">
        <div v-for="(th, thIndex) in props.items.columns" :key="thIndex" class="th">{{ th }}</div>
      </div>

      <div v-for="(row, rowIndex) in props.items.rows" :key="rowIndex" class="row">
        <div class="td">{{ row.title }}</div>
        <div class="td">{{ row.status }}</div>
        <div class="td">{{ row.amount }}</div>
        <div class="td">{{ row.wager }}</div>
        <div class="td">{{ row.date }}</div>
        <div class="td">{{ row.validUntil }}</div>
      </div>
    </div>

    <atomic-pagination @select-page="selectedPage = $event" :selected="selectedPage" :total="100"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Object,
      required: true,
    },
  });
  const selectedPage = ref<number>(1);
</script>

<style lang="scss" src="./style.scss"/>
