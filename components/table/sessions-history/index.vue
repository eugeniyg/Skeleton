<template>
  <div class="tb-sessions-history">
    <div class="row">
      <div
        v-for="(th, thItems) in props.items.columns"
        :key="thItems"
        class="th"
        v-html="th"
      />
    </div>

    <div v-for="(row, rowIndex) in props.items.rows" :key="rowIndex" class="row">
      <div class="td">
        <atomic-row-device :variant="row.device"/>
      </div>

      <div class="td">{{ row.country }}</div>

      <div class="td">
        <atomic-row-user-agent>{{ row.userAgent }}</atomic-row-user-agent>
      </div>

      <div class="td">{{ row.createdAt }}</div>

      <div class="td">
        <atomic-row-status :variant="row.status.variant">{{ row.status.text }}</atomic-row-status>
      </div>

      <div class="td">
        <button-close-session v-if="row.status.variant === 'current'"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Object,
      required: true,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
