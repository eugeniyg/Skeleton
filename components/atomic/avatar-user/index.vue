<template>
  <div class="avatar-user">
    <div class="row">
      <span class="thumb">
        <img class="img" src="~/assets/img/avatar-bg.png" alt="" />
      </span>

      <!--<div v-if="props.label" class="label">{{ props.label }}</div>-->
    </div>

    <div class="row">
      <div class="nickname">{{ profile.nickname || '' }}</div>

      <div v-if="activeAccount" class="amount">
        {{ activeAccount.formatBalance.amount }} {{ activeAccount.formatBalance.currency }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
</script>

<style lang="scss" src="./style.scss"/>
