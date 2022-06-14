<template>
  <div>
    <div class="tb-bets-history">
      <div class="row">
        <div v-for="(th, itemIndex) in props.items.columns" :key="itemIndex" class="th">{{ th }}</div>
      </div>

      <div v-for="({ game, bet, result, date }, itemIndex) in props.items.rows" :key="itemIndex" class="row">
        <div class="td">{{ game }}</div>
        <div class="td">{{ bet }}</div>
        <div class="td">{{ result }}</div>
        <div class="td">{{ date }}</div>
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
