<template>
  <vue-final-modal
    v-model="modals.questsHub"
    class="modal-quest-hub"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="container">
      <button-modal-close
        :class="{ 'close-secondary': hasOffset }"
        @click="closeModal('questsHub')"
      />

      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="modal-quest-hub__header">
          <div class="modal-quest-hub__title">
            {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.title') }}
          </div>
        </div>

        <div class="modal-quest-hub__tabs">
          <div class="modal-quest-hub__tabs-item"
               v-for="[tabId, tabLabel] in modalTabs"
               :key="tabId"
               :class="{'is-active': tabId === selectedTab}"
               @click="changeTabHandle(tabId)"
          >
            {{ tabLabel }}
          </div>
        </div>

        <component :is="loadTab(selectedTab)" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { VueFinalModal } from 'vue-final-modal';
import {
  QuestActive,
  QuestExpired,
  QuestCompleted,
} from '#components';

const layoutStore = useLayoutStore();
const { modals } = storeToRefs(layoutStore);
const { closeModal } = layoutStore;
const globalStore = useGlobalStore();
const {
  popupsData,
  defaultLocalePopupsData
} = storeToRefs(globalStore);

const modalTabs = computed(() => {
  const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.tabs');
  if (contentTabs) return Object.entries(contentTabs);
  return [];
})

const { getContent } = useProjectMethods();
const hasOffset = ref<boolean>(false);
const selectedTab = ref<string>('active');
const loadTab = (name:string):string => `quest-${name}`;

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