<template>
  <vue-final-modal
    v-model="modals.questHub"
    class="modal-quest-hub"
    displayDirective="show"
    @closed="closedEvent"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @click="closeModal('questHub')"/>
      
      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="modal-quest-hub__header">
          <div class="modal-quest-hub__title">{{ getContent(popupsData, defaultLocalePopupsData, 'questHub.title') }}</div>
        </div>
        
        <quest-accumulated-rewards/>
        
        <div class="modal-quest-hub__tabs">
          <div class="modal-quest-hub__tabs-item"
               v-for="tabId in Object.keys(questTabs)"
               :key="tabId"
               :class="{'is-active': tabId === selectedTab}"
               @click="changeTabHandle(tabId)"
          >
            {{ getContent(popupsData, defaultLocalePopupsData, `questHub.tabs.${tabId}`) }}
          </div>
        </div>
        
        <component :items="tasks" :is="loadTab(selectedTab)"/>
        
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  const { questHubPopupTasks } = useFakeStore();
  
  const formKey = ref<number>(0);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const {
    closeModal
  } = layoutStore;
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const hasOffset = ref<boolean>(false);
  
  const questTabs:any = {
    'active': resolveComponent('tab-quest-active'),
    'expired': resolveComponent('tab-quest-expired'),
    'completed': resolveComponent('tab-quest-completed')
  };
  
  const selectedTab = ref<string>('expired');
  
  const tasks = computed(() => questHubPopupTasks.filter(task => task.status && task.status === selectedTab.value))
  
  const loadTab = (tabId: string):any => questTabs[tabId]
  
  const closedEvent = (): void => {};
  
  const scrollBlock = ref();
  
  const handleScroll = (): void => {
    hasOffset.value = scrollBlock.value.scrollTop !== 0;
  };
  
  const changeTabHandle = (tabId: string) => {
    if (selectedTab.value === tabId) return;
    
    selectedTab.value = tabId;
  };
</script>

<style src="~/assets/styles/components/modal/quest-hub.scss" lang="scss"/>

