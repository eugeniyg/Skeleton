<template>
  <div class="cash-tabs">
    <div
      class="cash-tabs__item"
      :class="{'is-selected': props.selected === id}"
      v-for="{id, label} in props.items"
      @click="changeTab(id)"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    selected: string,
    items: { id: string, label: string }[]
  }>();
  
  const emit = defineEmits(['changeTab'])
  
  const changeTab = (id:string):void => {
    emit('changeTab', id);
  }
</script>

<style src="~/assets/styles/components/cash/tabs.scss" lang="scss"/>