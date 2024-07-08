<template>
  <nav class="nav-user">
    <div class="nav-user__header">
      <atomic-avatar-user/>
      
      <template v-if="isLoggedIn">
        <atomic-divider/>
        <loyalty-progress-display class="is-user-nav"/>
        <button-base type="primary" size="md">
          <atomic-icon id="plus"/>
          <span>Deposit</span>
        </button-base>
      </template>
    </div>
    
    <div class="items">
      <div
        v-for="(item, index) in profileLinks"
        :key="index"
        class="item"
        :class="{ 'is-active': route.path === localizePath(item.url) }"
        @click="clickItem(item.url)"
      >
        <atomic-icon :id="item.icon" />
        {{ item.label }}
      </div>
    </div>

    <atomic-divider/>
    <button-logout @logout="emit('logout')"/>
  </nav>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  
  const emit = defineEmits(['logout']);
  const { localizePath, handleExternalLink } = useProjectMethods();
  const { closeUserNav } = useLayoutStore();
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const profileLinks = layoutData?.profileSidebar?.profileLinks || defaultLocaleLayoutData?.profileSidebar?.profileLinks || [];
  const route = useRoute();
  
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const clickItem = (url: string):void => {
    closeUserNav();
    handleExternalLink(url)
  }
</script>

<style src="~/assets/styles/components/nav/user.scss" lang="scss" />

