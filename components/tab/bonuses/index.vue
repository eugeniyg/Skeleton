<template>
  <div class="tabs-bonuses">
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

    <div class="tab-bonuses">
      <component :is="loadTab(selected)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const selected = ref<string>('bonus-code');

  const loadTab = (name:string):string => `tab-bonuses-${name}`;
</script>

<style lang="scss" src="./style.scss"/>
