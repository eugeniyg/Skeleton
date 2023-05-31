<template>
  <div class="nav-mode">
    <button
      v-for="{icon, id} in props.items"
      :key="id"
      class="item"
      @click="toggleActive(id)"
      :class="{'is-active': isActive(id) }"
    >
      <atomic-icon :id="icon"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const selected = ref<string>('device');

  const isActive = (id:string):boolean => selected.value === id;
  const toggleActive = (id:string):void => {
    selected.value = id;
  };
</script>

<style src="~/assets/styles/components/nav/mode.scss" lang="scss" />

