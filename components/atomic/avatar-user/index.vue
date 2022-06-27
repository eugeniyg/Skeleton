<template>
  <div class="avatar-user">
    <div class="row">
      <span class="thumb">
        <img class="img" src="~/assets/img/avatar-bg.png" alt="" />
      </span>

      <!--<div v-if="props.label" class="label">{{ props.label }}</div>-->
    </div>

    <div class="row">
      <div class="nickname">{{ publicNickname }}</div>

      <div v-if="activeAccount" class="amount">
        {{ activeAccount.formatBalance.amount }} {{ activeAccount.formatBalance.currency }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '',
    },
    amount: {
      type: Array,
      default: () => [],
    },
  });

  const profileStore = useProfileStore();
  const { publicNickname } = storeToRefs(profileStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
</script>

<style lang="scss" src="./style.scss"/>
