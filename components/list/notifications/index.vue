<template>
  <div class="notifications">
    <div class="header">
      <div class="total">{{ props.items.length }} new notifications</div>

      <button-base type="ghost" size="xs">
        <atomic-icon id="ui-read-all"/>Mark all as read
      </button-base>
    </div>

    <atomic-divider/>

    <div class="items">
      <atomic-msg v-for="(item, index) in filteredItems" :key="index" v-bind="item"/>
    </div>

    <atomic-divider/>

    <button-base type="ghost" size="xs" @click="emit('read-all')">
      Read all<atomic-icon id="ui-arrow_next"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    max: {
      type: Number,
      default: 5,
    },
    items: {
      type: Array,
      default: () => [],
    },
  });
  const filteredItems = computed(() => (props.max ? props.items.slice(0, props.max) : props.items));
  const emit = defineEmits(['read-all']);
</script>

<style lang="scss" src="./style.scss"/>
