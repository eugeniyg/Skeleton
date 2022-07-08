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
        <div class="td" v-html="row.date"/>
        <div class="td" v-html="row.validUntil"/>
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
