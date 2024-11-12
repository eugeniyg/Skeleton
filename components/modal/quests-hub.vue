<template>
  <vue-final-modal
    v-model="modals.questsHub"
    class="modal-quest-hub"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('questsHub')"
    @closed="selectedTab = 'active'"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @click="closeModal('questsHub')" />

      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="modal-quest-hub__header">
          <div class="modal-quest-hub__title">
            {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.title') }}
          </div>
        </div>

        <div class="modal-quest-hub__tabs">
          <div
            v-for="[tabId, tabLabel] in modalTabs"
            :key="tabId"
            class="modal-quest-hub__tabs-item"
            :class="{ 'is-active': tabId === selectedTab }"
            @click="changeTabHandle(tabId)"
          >
            {{ tabLabel }}
          </div>
        </div>

        <quest-active v-show="selectedTab === 'active'" />
        <quest-expired v-show="selectedTab === 'expired'" />
        <quest-completed v-show="selectedTab === 'completed'" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);

  const modalTabs = computed(() => {
    const contentTabs = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.tabs');
    if (contentTabs) return Object.entries(contentTabs);
    return [];
  });

  const { getContent } = useProjectMethods();
  const hasOffset = ref<boolean>(false);
  const selectedTab = ref<string>('active');

  const scrollBlock = ref();
  const handleScroll = (): void => {
    hasOffset.value = scrollBlock.value.scrollTop !== 0;
  };

  const changeTabHandle = (tabId: string) => {
    if (selectedTab.value === tabId) return;

    selectedTab.value = tabId;
  };
</script>

<style src="~/assets/styles/components/modal/quest-hub.scss" lang="scss" />
