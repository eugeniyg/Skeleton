<template>
  <div class="tabs-history">
    <div class="nav">
      <div
        class="item"
        v-for="{ title, id } in props.items"
        :key="id"
        :class="{'is-selected': id === selected}"
        @click="selected = id"
      >
        {{ title }}
      </div>
    </div>

    <div class="tab-history">
      <component :is="loadTab(selected)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
    },
  });
  const selected = ref<string>('bonuses-history');
  const loadTab = (name:string):string => `tab-history-${name}`;
</script>

<style lang="scss" src="./style.scss"/>
