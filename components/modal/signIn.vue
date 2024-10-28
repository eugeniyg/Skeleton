<template>
  <vue-final-modal
    class="modal-sign-in"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('signIn')"/>
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>

      
      <div v-if="tabsList.length && displayType === 'both'">
        <div class="modal-sign-in__tabs">
          <button-base
            v-for="tab in tabsList"
            :key="tab.id"
            :isActive="tab.id === selectedTab"
            size="xs"
            @click="changeTab(tab.id as 'email'|'phone')"
          >
            <atomic-icon :id="tab.icon"/>
            <span class="text">{{ tab.label }}</span>
          </button-base>
        </div>
        
        <atomic-divider class="modal-sign-in__tabs-divider"/>
      </div>
      
      <form-sign-in :key="selectedTab" :loginType="selectedTab" :count="selectedCount"/>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type {IModalsContent} from "~/types";

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['login']>;
    defaultLocaleData: Maybe<IModalsContent['login']>;
  }>();

  const { closeModal } = useModalStore();
  const { getContent } = useProjectMethods();
  
  const tabsList = computed(() => {
    const tabsObj = getContent(props.currentLocaleData, props.defaultLocaleData, 'login.tabs');
    if (!tabsObj) return [];
    
    return Object.keys(tabsObj)
      .map(key => {
        if (key === 'email') {
          return {
            id: 'email',
            icon: 'mail',
            label: tabsObj[key]
          };
        }
        return {
          id: 'phone',
          icon: 'mobile',
          label: tabsObj[key]
        };
      });
  });
  
  const displayType = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'type');
  });
  
  const selectedTab = ref<'email'|'phone'>('email');
  const selectedCount = ref(0);
  
  const changeTab = (newTabId: 'email' | 'phone'): void => {
    if (selectedTab.value === newTabId) return;
    selectedTab.value = newTabId;
    selectedCount.value++;
  };
  
  onMounted(() => {
    selectedTab.value = (displayType.value !== 'both') ? displayType.value : 'email'
  });

</script>

<style src="~/assets/styles/components/modal/sign-in.scss" lang="scss"/>

