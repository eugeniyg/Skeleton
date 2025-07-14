<template>
  <nav class="nav-user">
    <div class="nav-user__loyalty">
      <div class="nav-user__common" @click="clickCommonInfo">
        <loyalty-avatar size="md" />

        <div class="nav-user__common-info">
          <div class="nickname">
            {{ userNickname }}
          </div>

          <atomic-external-id ref="refExternalIdComponent" />

          <div v-if="activeAccount" class="amount">{{ balanceFormat.amount }} {{ balanceFormat.currency }}</div>
        </div>
      </div>

      <template v-if="loyaltyEnabled">
        <atomic-divider />

        <loyalty-progress />

        <button-base type="primary" size="md" @click="clickDeposit">
          <atomic-icon id="plus" />

          <span>{{ getContent(layoutData, defaultLocaleLayoutData, 'profileSidebar.depositButton') }}</span>
        </button-base>
      </template>
    </div>

    <div class="items">
      <div
        v-for="(item, index) in profileLinks"
        :key="index"
        class="item"
        :class="{ 'is-active': route.path === localizePath(item.url) }"
        @click="clickItem(item.url)"
      >
        <atomic-icon :id="item.icon" />
        {{ item.label }}

        <span v-if="item.url === '/profile/bonuses' && bonusesCount" class="count">
          {{ bonusesCount > 99 ? '99+' : bonusesCount }}
        </span>

        <span v-if="item.url === '/profile/notifications' && unreadCount" class="count">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </div>
    </div>

    <atomic-divider />
    <button-logout @logout="emit('logout')" />
  </nav>
</template>

<script setup lang="ts">
  import type { AtomicExternalId } from '#components';
  import { formatBalance } from '@skeleton/helpers/amountMethods';
  import { handleExternalLink } from '@skeleton/helpers/simpleMethods';

  const emit = defineEmits(['logout']);
  const { closeUserNav } = useLayoutStore();
  const { openWalletModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { layoutData, defaultLocaleLayoutData } = globalStore;
  const { isMobile } = storeToRefs(globalStore);
  const profileLinks = getContent(layoutData, defaultLocaleLayoutData, 'profileSidebar.profileLinks') || [];
  const route = useRoute();

  const runtimeConfig = useRuntimeConfig();
  const loyaltyEnabled = runtimeConfig.public?.loyaltyEnabled;
  const profileStore = useProfileStore();
  const { userNickname } = storeToRefs(profileStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));
  const refExternalIdComponent = useTemplateRef<typeof AtomicExternalId>('refExternalIdComponent');

  const clickItem = (url: string): void => {
    closeUserNav();
    handleExternalLink(url);
  };

  const clickDeposit = (): void => {
    closeUserNav();
    openWalletModal('deposit');
  };

  const clickCommonInfo = (): void => {
    if (isMobile.value && refExternalIdComponent.value) {
      refExternalIdComponent.value?.copyExternalId();
    }
  };

  const notificationStore = useNotificationStore();
  const { unreadCount } = storeToRefs(notificationStore);

  const bonusStore = useBonusStore();
  const { bonusesCount } = storeToRefs(bonusStore);
</script>

<style src="~/assets/styles/components/nav/user.scss" lang="scss" />
