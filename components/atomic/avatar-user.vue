<template>
  <div class="avatar-user">
    <div class="row">
      <span class="thumb">
        <atomic-image class="img" src="/img/avatar-bg.png" />
      </span>
    </div>

    <div class="row">
      <div class="nickname">
        {{ userNickname }}
      </div>

      <div v-if="activeAccount" class="amount">
        {{ balanceFormat.amount }} {{ balanceFormat.currency }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const profileStore = useProfileStore();
  const { userNickname } = storeToRefs(profileStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const { formatBalance } = useProjectMethods();
  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));
</script>

<style src="~/assets/styles/components/atomic/avatar-user.scss" lang="scss" />
