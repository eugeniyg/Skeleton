<template>
  <div ref="scrollBlock" class="wallet-forms" @scroll="handleScroll">
    <div class="wallet-forms__header" :class="{ 'wallet-forms__header--without-tabs': !props.showTabs }">
      <wallet-tabs v-if="props.showTabs" :selected="props.selectedTab" @change-tab="emit('changeTab', $event)" />

      <wallet-header v-bind="walletHeaderProps" />
      <div class="identity">ID {{ playerIdentity }}</div>
    </div>

    <div class="wallet-forms__header-secondary">
      <div class="wallet-forms__header-secondary-title">
        {{ props.modalTitle }}
      </div>

      <div class="identity">ID {{ playerIdentity }}</div>
    </div>

    <template v-if="props.selectedTab === 'deposit'">
      <wallet-limit
        v-if="depositLimitError"
        :current-locale-limits-content="pageContent?.currentLocaleData"
        :default-locale-limits-content="pageContent?.defaultLocaleData"
      />

      <template v-else-if="depositMethods?.length && props.currentDepositMethod">
        <form-deposit
          v-if="props.currentDepositMethod.type === 'form'"
          :key="`fiat-${props.currentDepositMethod.method}-${depositMethodKey}-${showMobileFormKey}`"
          v-bind="props.currentDepositMethod"
        />

        <form-deposit-crypto
          v-else-if="props.currentDepositMethod.type === 'address'"
          v-bind="props.currentDepositMethod"
          :key="`crypto-${props.currentDepositMethod.method}-${depositMethodKey}-${showMobileFormKey}`"
        />
      </template>

      <div v-else class="wallet-modal__empty-methods">
        <atomic-icon id="info" />

        <span>
          {{ getContent(walletContent, defaultLocaleWalletContent, 'notAvailableText') }}
        </span>
      </div>
    </template>

    <template v-else-if="props.selectedTab === 'withdraw'">
      <wallet-turn-over-wager v-if="showTurnOverModal" />

      <form-withdraw
        v-else-if="withdrawMethods?.length && props.currentWithdrawMethod"
        :key="`${props.currentWithdrawMethod.method}-${showMobileFormKey}`"
        v-bind="props.currentWithdrawMethod"
      />

      <div v-else class="wallet-modal__empty-methods">
        <atomic-icon id="info" />

        <span>
          {{ getContent(walletContent, defaultLocaleWalletContent, 'notAvailableText') }}
        </span>
      </div>
    </template>

    <wallet-dots :items-count="2" :active-index="1" />
  </div>
</template>

<script setup lang="ts">
  import type { IPaymentMethod } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';
  import type { IProfileLimits, IWalletModal } from '~/types';

  const props = defineProps<{
    showTabs: boolean;
    selectedTab: string;
    modalTitle: string;
    currentDepositMethod?: IPaymentMethod;
    currentWithdrawMethod?: IPaymentMethod;
    showMobileForm: boolean;
  }>();

  const emit = defineEmits(['changeTab']);

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const hasOffset = ref<boolean>(false);
  const scrollBlock = ref();
  const { getContent } = useProjectMethods();
  const depositMethodKey = ref<number>(0);

  const walletStore = useWalletStore();
  const { depositMethods, withdrawMethods, activeAccount, activeAccountType, depositLimitError } =
    storeToRefs(walletStore);

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const handleScroll = (): void => {
    hasOffset.value = scrollBlock.value.scrollTop !== 0;
  };

  const runtimeConfig = useRuntimeConfig();
  const customerCdn = runtimeConfig.public.customerCdn;
  const methodLogoUrl = computed(() => {
    if (props.selectedTab === 'deposit' && props.currentDepositMethod?.logo) {
      if (props.currentDepositMethod.logo.startsWith('http')) return props.currentDepositMethod.logo;
      if (customerCdn) return `${customerCdn}${props.currentDepositMethod.logo}`;
    }

    if (props.selectedTab === 'withdraw' && props.currentWithdrawMethod?.logo) {
      if (props.currentWithdrawMethod.logo.startsWith('http')) return props.currentWithdrawMethod.logo;
      if (customerCdn) return `${customerCdn}${props.currentWithdrawMethod.logo}`;
    }

    if (props.selectedTab === 'withdraw' && props.currentWithdrawMethod?.method === '0x.withdrawal.cash_agent') {
      return '/img/methods-icons/cash-agent.svg';
    }

    if (activeAccountType.value === 'fiat') return '/img/methods-icons/cards.svg';

    if (activeAccount.value?.currency) return `/img/methods-icons/${activeAccount.value.currency}.svg`;

    return undefined;
  });

  const walletHeaderProps = computed(() => ({
    src: methodLogoUrl.value,
    defaultImage:
      activeAccountType.value === 'fiat' ? '/img/methods-icons/cards.svg' : '/img/methods-icons/crypto-placeholder.svg',
    title: getContent(walletContent, defaultLocaleWalletContent, `tabs.${props.selectedTab}`),
    subTitle: activeAccount.value?.currency,
  }));

  const playerIdentity = computed(() => {
    if (!profile.value?.id) return '';
    return profile.value.id.split('-')[0].toUpperCase();
  });

  const riskStore = useRiskStore();
  const enableTurnOverWagerModal = runtimeConfig.public.enableTurnOverWager;
  const { turnOverWagerData } = storeToRefs(riskStore);
  const showTurnOverModal = computed(() => {
    return enableTurnOverWagerModal && turnOverWagerData.value?.turnOverWagerAmount > 0;
  });

  // << GET CONTENT FOR DEPOSIT LIMIT
  const contentParams = {
    contentKey: 'coolingOffLimitsContent',
    contentRoute: ['profile', 'limits'],
    only: ['coolingOff'],
  };
  const { getContentData } = useContentLogic<IProfileLimits>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  // >>

  const showMobileFormKey = ref<number>(0);
  watch(
    () => props.showMobileForm,
    newValue => {
      if (!newValue) {
        setTimeout(() => {
          showMobileFormKey.value += 1;
        }, 400);
      }
    }
  );

  watch(
    () => depositMethods.value,
    () => {
      depositMethodKey.value += 1;
    }
  );
</script>

<style src="~/assets/styles/components/wallet/forms.scss" lang="scss" />
