<template>
  <div class="wallet-tabs">
    <div
      class="wallet-tabs__item"
      :class="{ 'is-selected': props.selected === id }"
      v-for="{ id, label } in tabItems"
      @click="changeTab(id)"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";

  const props = defineProps<{
    selected: string;
  }>();

  const emit = defineEmits(['changeTab']);

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);


  const tabItems = computed(() => {
    const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.tabs') || {};
    return Object.keys(contentTabs).map(key => ({ id: key, label: contentTabs[key] }));
  })

  const changeTab = (id:string):void => {
    if (props.selected === id) return;
    emit('changeTab', id);
  }
</script>

<style src="~/assets/styles/components/wallet/tabs.scss" lang="scss"/>