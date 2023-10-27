<template>
  <div class="cash-pills">
    <div
      class="cash-pills__item"
      :class="{'is-selected': item === selected }"
      v-for="item in items"
      @click="selectItem(item)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const items = [ 50, 100, 500, 1000 ];
  
  const emit = defineEmits(['change']);
  
  const selected = ref<number>(items[0]);
  
  const selectItem = (item: number):void => {
    selected.value = item;
    emit('change', item);
  };
</script>

<style src="~/assets/styles/components/cash/pills.scss" lang="scss"/>