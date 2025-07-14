<template>
  <button v-click-outside="makeInactive" class="btn-deposit" :class="{ 'is-active': isActive }" @click="makeActive">
    <atomic-icon id="wallet" />
    <span>
      {{ getContent(layoutData, defaultLocaleLayoutData, 'header.depositButton') }}
    </span>
  </button>
</template>

<script setup lang="ts">
  const { openWalletModal } = useModalStore();
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const isActive = ref<boolean>(false);

  const makeActive = () => {
    isActive.value = true;
    openWalletModal();
  };

  const makeInactive = () => {
    isActive.value = false;
  };
</script>

<style src="~/assets/styles/components/button/deposit.scss" lang="scss" />
