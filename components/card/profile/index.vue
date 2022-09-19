<template>
  <div class="card-profile">
    <atomic-avatar :nickname="userNickname">
      <template v-slot:progress-bar>
        <profile-progress-bar/>
      </template>
    </atomic-avatar>

    <div class="actions">
      <button-base type="primary" size="md" @click="openDepositModal">
        <atomic-icon id="plus"/>{{ profileMenuContent?.depositButton}}
      </button-base>

      <button-base
        v-if="profileMenuContent?.profileButton"
        type="secondary"
        size="md"
        :url="profileMenuContent.profileButton.url"
      >
        {{ profileMenuContent.profileButton.label}}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { sidebarContent } = useGlobalStore();
  const profileMenuContent = sidebarContent?.profileMenu;
  const profileStore = useProfileStore();
  const { openDepositModal } = useLayoutStore();
  const { userNickname } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"/>
