<template>
  <div class="betting">
    <div class="container">
      <iframe
        v-if="frameLink"
        :key="frameLink"
        :src="frameLink"
        height="100%"
        width="100%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useGamesApi } from '~/CORE';

  definePageMeta({
    middleware: ['auth'],
  });

  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const frameLink = ref<string>('');

  const { getStartGame } = useGamesApi();

  onMounted(async () => {
    if (isMobile.value) {
      document.querySelector('footer').style.display = 'none';
    }

    walletStore.updateAccounts();

    const redirectUrl = window.location.origin;
    const startParams = {
      accountId: activeAccount.value.id,
      lobbyUrl: redirectUrl,
      locale: 'en',
      countryCode: 'UA',
      demoMode: false,
      platform: isMobile.value ? 1 : 2,
    };
    const startResponse = await getStartGame('10239b19-ddcb-4ba5-b95d-417f3cbbb1bc', startParams);
    frameLink.value = startResponse.gameUrl;
  });

  onBeforeUnmount(() => {
    walletStore.stopUpdateAccounts();
    document.querySelector('footer').style.display = null;
  });
</script>

<style lang="scss" src="./style.scss"/>
