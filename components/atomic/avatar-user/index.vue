<template>
  <div class="avatar-user">
    <div class="row">
      <span class="thumb">
        <img class="img" src="~/assets/img/avatar-bg.png" alt="" />
      </span>

      <!--<div v-if="props.label" class="label">{{ props.label }}</div>-->
    </div>

    <div class="row">
      <div class="nickname">{{ userNickname }}</div>

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
  const balanceFormat = computed(() => formatBalance(activeAccount.value.currency, activeAccount.value.balance));
</script>

<style lang="scss" src="./style.scss"/>
