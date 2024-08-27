<template>
  <div class="bonuses-tabs">
    <div class="bonuses-tabs__nav">
      <div class="bonuses-tabs__nav-item"
           v-for="[tabId, tabLabel] in modalTabs"
           :key="tabId"
           :class="{'is-active': tabId === selectedTab}"
           @click="changeTabHandle(tabId)"
      >
        <atomic-icon :id="icons?.[tabId]" />
        <span>{{ tabLabel }}</span>
      </div>
    </div>
    
    <bonuses-tabs-tab />
    
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  
  const selectedTab = ref<string>('casino');
  
  const modalTabs = computed(() => {
    const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'bonusInfo.tabs');
    if (contentTabs) return Object.entries(contentTabs);
    return [];
  });
  
  const { getContent } = useProjectMethods();
  
  const icons:any = {
    casino: "cherry",
    sportsbook: "sportsbook-football"
  };
  
  const changeTabHandle = (tabId: string) => {
    if (selectedTab.value === tabId) return;
    
    selectedTab.value = tabId;
  };

</script>

<style src="~/assets/styles/components/bonuses/tabs/index.scss" lang="scss"/>
