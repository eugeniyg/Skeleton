<template>
  <div class="tab-history__tb">
    <div class="tb-transactions-history">
      <div class="row">
        <div v-for="(th, thIndex) in props.items.columns" :key="thIndex" class="th">{{ th }}</div>
      </div>

      <div v-for="(row, rowIndex) in props.items.rows" :key="rowIndex" class="row">
        <div class="td" v-html="row.date"/>
        <div class="td">{{ row.type }}</div>
        <div class="td">{{ row.paymentMethod }}</div>

        <div class="td">
          <atomic-row-status :variant="row.status.type">{{ row.status.title }}</atomic-row-status>
        </div>

        <div class="td">{{ row.sum }}</div>

        <div class="td">
          <atomic-tooltip v-if="row.tooltip" :title="row.tooltip.title" :text="row.tooltip.text"/>
        </div>

        <div class="actions" v-if="row.status.type === 'pending'">
          <button-base
            class="btn-cancel-payment"
            type="secondary"
            size="sm"
          >
            <atomic-icon id="ui-trash"/>
            <span>Cancel payment</span>
          </button-base>
        </div>
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
