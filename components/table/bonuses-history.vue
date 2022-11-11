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
        <div class="td">{{ row.progress }}</div>
        <div class="td" v-html="format(getFormatDate(row.date))"/>
        <div class="td" v-html="format(getFormatDate(row.validUntil))"/>
      </div>
    </div>

    <atomic-pagination @select-page="selectedPage = $event" :selected="selectedPage" :total="100"/>
  </div>
</template>

<script setup lang="ts">
  const { getFormatDate } = useProjectMethods();

  const props = defineProps({
    items: {
      type: Object,
      required: true,
    },
  });
  const selectedPage = ref<number>(1);

  const format = (str:string) => str.split(',').join('<br>');
</script>

<style lang="scss">
.tb-bonuses-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  padding-bottom: rem(8px);

  .row {
    grid-template-columns:
      minmax(rem(156px), 1fr)
      minmax(rem(105px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(75px), 1fr)
      minmax(rem(100px), 1fr)
      minmax(rem(100px), 1fr);
  }
}
</style>
