<template>
  <div ref="card" class="card-wallet" :class="{ 'is-active': isActive }">
    <div class="content">
      <div class="title">{{ currencyName }}</div>

      <form-input-toggle v-if="!isActive" name="toggle" :value="isChecked" @change="clickToggle">
        {{ props.content?.changeButton }}
      </form-input-toggle>

      <div class="amount">
        <span class="amount">{{ balanceFormat.amount }}</span>
        <span class="currency">{{ balanceFormat.currency }}</span>
      </div>

      <button-base v-if="showHideCurrencyButton" class="hide-currency" type="ghost" size="xs" @click="hide">
        {{ props.content?.hideButton }}
      </button-base>

      <div v-if="isActive" class="actions">
        <button-base type="primary" size="sm" @click="openWalletModal('deposit')">
          {{ props.content?.depositButton }}
        </button-base>

        <button-base type="secondary" size="sm" @click="openWalletModal('withdraw')">
          {{ props.content?.withdrawButton }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileWallet } from '~/types';

  const props = defineProps<{
    id: string;
    balance: number;
    currency: string;
    status: number;
    content: Maybe<IProfileWallet>;
  }>();

  const isChecked = ref<boolean>(false);
  const { currencies } = useGlobalStore();
  const { openWalletModal } = useModalStore();
  const { formatBalance } = useProjectMethods();
  const balanceFormat = computed(() => formatBalance(props.currency, props.balance));

  const isActive = computed(() => props.status === 1);
  const showHideCurrencyButton = computed(() => props.balance === 0 && !isActive.value);
  const currentCurrency = currencies.find(curr => curr.code === props.currency);
  const currencyName = computed(() => `${currentCurrency?.name} (${currentCurrency?.code})`);

  const { switchAccount, hideAccount } = useWalletStore();

  const card = ref<HTMLElement>();

  const changeActive = async (): Promise<void> => {
    await switchAccount(props.id);
    isChecked.value = false;
  };

  const clickToggle = (): void => {
    isChecked.value = true;
    document.querySelector('.card-wallet')?.classList.remove('is-active');
    card.value?.classList.add('is-active');
    setTimeout(() => {
      changeActive();
    }, 400);
  };

  const hide = async (): Promise<void> => {
    await hideAccount(props.id);
  };
</script>

<style src="~/assets/styles/components/card/wallet.scss" lang="scss" />
