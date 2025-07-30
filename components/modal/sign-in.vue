<template>
  <vue-final-modal
    class="modal-sign-in"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('sign-in')" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>

      <div v-if="tabsList.length && loginType === 'both'">
        <div class="modal-sign-in__tabs">
          <button-base
            v-for="tab in tabsList"
            :key="tab.id"
            :is-active="tab.id === selectedTab"
            size="xs"
            @click="changeTab(tab.id as 'email' | 'phone')"
          >
            <atomic-icon :id="tab.icon" />
            <span class="text">{{ tab.label }}</span>
          </button-base>
        </div>

        <atomic-divider class="modal-sign-in__tabs-divider" />
      </div>

      <form-sign-in
        :key="selectedTab"
        :login-type="selectedTab"
        :count="selectedCount"
        :current-locale-data="props.currentLocaleData"
        :default-locale-data="props.defaultLocaleData"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['signIn']>;
    defaultLocaleData: Maybe<IModalsContent['signIn']>;
  }>();

  const { closeModal } = useModalStore();
  const loginType = getContent(props.currentLocaleData, props.defaultLocaleData, 'tabsDisplay') || 'both';

  const tabsList = computed(() => {
    const tabsObj = getContent(props.currentLocaleData, props.defaultLocaleData, 'tabs');
    if (!tabsObj) return [];

    return Object.keys(tabsObj).map(key => {
      if (key === 'email') {
        return {
          id: 'email',
          icon: 'mail',
          label: tabsObj[key],
        };
      }
      return {
        id: 'phone',
        icon: 'mobile',
        label: tabsObj[key],
      };
    });
  });

  const selectedTab = ref<'email' | 'phone'>(loginType === 'both' ? 'email' : loginType);
  const selectedCount = ref(0);

  const changeTab = (newTabId: 'email' | 'phone'): void => {
    if (selectedTab.value === newTabId) return;
    selectedTab.value = newTabId;
    selectedCount.value++;
  };
</script>

<style src="~/assets/styles/components/modal/sign-in.scss" lang="scss" />
