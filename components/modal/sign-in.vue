<template>
  <vue-final-modal
    v-model="modals.signIn"
    class="modal-sign-in"
    :clickToClose="false"
    @closed="selectedTab = 'email'"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('signIn')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'login.title') }}</div>
      </div>

      <template v-if="tabsList.length">
        <div  class="modal-sign-in__tabs">
          <button-base
            v-for="tab in tabsList"
            :key="tab.id"
            :isActive="tab.id === selectedTab"
            size="xs"
            @click="changeTab(tab.id as 'email'|'phone')"
          >
            <atomic-icon :id="tab.icon" />
            <span class="text">{{ tab.label }}</span>
          </button-base>
        </div>

        <atomic-divider class="modal-sign-in__tabs-divider" />
      </template>

      <form-sign-in :key="selectedTab" :loginType="selectedTab" />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const tabsList = computed(() => {
    const tabsObj = getContent(popupsData, defaultLocalePopupsData, 'login.tabs');
    if (!tabsObj) return [];

    return Object.keys(tabsObj).map(key => {
      if (key === 'email') return { id: 'email', icon: 'mail', label: tabsObj[key] };
      return { id: 'phone', icon: 'mobile', label: tabsObj[key] };
    })
  });
  const selectedTab = ref<'email'|'phone'>('email');

  const changeTab = (newTabId: 'email'|'phone'): void => {
    if (selectedTab.value === newTabId) return;
    selectedTab.value = newTabId;
  }
</script>

<style src="~/assets/styles/components/modal/sign-in.scss" lang="scss" />

