<template>
  <div class="wallet-tabs">
    <div
      v-for="{ id, label } in tabItems"
      :key="id"
      class="wallet-tabs__item"
      :class="{ 'is-selected': props.selected === id }"
      @click="changeTab(id)"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const props = defineProps<{
    selected: string;
  }>();

  const emit = defineEmits(['changeTab']);

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');

  const tabItems = computed(() => {
    const contentTabs = getContent(walletContent, defaultLocaleWalletContent, 'tabs') || {};
    return Object.keys(contentTabs).map(key => ({ id: key, label: contentTabs[key] }));
  });

  const changeTab = (id: string): void => {
    if (props.selected === id) return;
    emit('changeTab', id);
  };
</script>

<style src="~/assets/styles/components/wallet/tabs.scss" lang="scss" />
