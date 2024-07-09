<template>
  <div class="loyalty-info">
    <atomic-avatar-logo
      user-img="/img/avatar-bg.png"
      class="loyalty-info__avatar"
    />
    <div class="loyalty-info__nickname" v-if="profile?.nickname">{{ profile?.nickname }}</div>
    <loyalty-progress-display class="loyalty-info__progress"/>
    
    <div class="loyalty-info__actions">
      <atomic-divider/>
      <button-base type="primary" size="md">Deposit</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/components/loyalty/info.scss" lang="scss" />
