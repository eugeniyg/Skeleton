<template>
  <vue-final-modal
    class="modal-quest-hub"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('quests-hub')"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @click="closeModal('quests-hub')" />

      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="modal-quest-hub__header">
          <div class="modal-quest-hub__title">
            {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
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
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['questsHub']>;
    defaultLocaleData: Maybe<IModalsContent['questsHub']>;
  }>();

  provide('questsHubContent', props.currentLocaleData);
  provide('defaultLocaleQuestsHubContent', props.defaultLocaleData);

  const { closeModal } = useModalStore();
  const modalTabs = computed(() => {
    const contentTabs = getContent(props.currentLocaleData, props.defaultLocaleData, 'tabs');
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
