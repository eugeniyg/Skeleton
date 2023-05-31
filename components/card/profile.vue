<template>
  <div class="card-profile">
    <atomic-avatar :nickname="userNickname"/>

    <div class="actions">
      <button-base type="primary" size="md" @click="openDepositModal">
        <atomic-icon id="plus"/>{{ getContent(sidebarContent, defaultLocaleSidebarContent, 'profileMenu.depositButton') }}
      </button-base>

      <button-base
        v-if="getContent(sidebarContent, defaultLocaleSidebarContent, 'profileMenu.profileButton')"
        type="secondary"
        size="md"
        :url="getContent(sidebarContent, defaultLocaleSidebarContent, 'profileMenu.profileButton.url')"
      >
        {{ getContent(sidebarContent, defaultLocaleSidebarContent, 'profileMenu.profileButton.label') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { sidebarContent, defaultLocaleSidebarContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const profileStore = useProfileStore();
  const { openDepositModal } = useLayoutStore();
  const { userNickname } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/components/card/profile.scss" lang="scss" />

