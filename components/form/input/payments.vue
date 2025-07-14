<template>
  <div class="input-payments">
    <div v-if="props.items?.length" class="items">
      <div
        v-for="(item, i) in props.items"
        :key="i"
        class="item"
        :class="{ 'is-selected': item.method === props.activeMethod?.method }"
        @click="select(item)"
      >
        <atomic-image
          class="mask"
          :src="paymentLogos[i]"
          :default-image="
            activeAccountType === 'fiat' ? '/img/methods-icons/cards.svg' : '/img/methods-icons/crypto-placeholder.svg'
          "
        />

        <div class="input-payments__min">
          {{ getContent(walletContent, defaultLocaleWalletContent, 'methodMin') }}
          {{ methodsMinSum[i] }}
        </div>
      </div>
    </div>
    <input type="hidden" name="payments" :value="props.activeMethod?.method" />
  </div>
</template>

<script setup lang="ts">
  import type { IPaymentMethod } from '@skeleton/api/types';
  import type { IWalletModal } from '~/types';
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    items?: IPaymentMethod[];
    activeMethod?: IPaymentMethod;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');

  const emit = defineEmits(['update:activeMethod', 'methodClick']);
  const cashAgentMethodKey: string = '0x.withdrawal.cash_agent';

  const select = (method: IPaymentMethod): void => {
    emit('methodClick');

    if (props.activeMethod?.method === method.method) return;
    emit('update:activeMethod', method);
  };

  const paymentLogos = ref<string[]>([]);
  const methodsMinSum = ref<string[]>([]);

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const getMinMethodSum = (minAmount: number): string => {
    const { amount, currency } = formatBalance(activeAccount.value?.currency, minAmount);
    return `${amount} ${currency}`;
  };

  const setMethodsMinSum = (): void => {
    if (!props.items) methodsMinSum.value = [];
    else {
      methodsMinSum.value = props.items?.map((method: any) => {
        return getMinMethodSum(method.amountMin);
      });
    }
  };

  const runtimeConfig = useRuntimeConfig();
  const customerCdn = runtimeConfig.public.customerCdn;
  const setPaymentLogos = (): void => {
    if (!props.items) paymentLogos.value = [];
    else
      paymentLogos.value = props.items.map(methodData => {
        if (methodData.logo) {
          if (methodData.logo.startsWith('http')) return methodData.logo;
          if (customerCdn) return `${customerCdn}${methodData.logo}`;
        }
        if (methodData.method === cashAgentMethodKey) return '/img/methods-icons/cash-agent.svg';
        if (activeAccountType.value === 'fiat') return '/img/methods-icons/cards.svg';
        if (activeAccount.value?.currency) return `/img/methods-icons/${activeAccount.value?.currency}.svg`;
        return '';
      });
  };

  // FOR STATIC LOGO URL AND MIN DEPOSIT SUM
  // WITH REACTIVITY, THIS PARAMS UPDATE ASYNC BECAUSE OF REACTIVE activeAccount
  setPaymentLogos();
  setMethodsMinSum();

  watch(
    () => props.items,
    () => {
      setPaymentLogos();
      setMethodsMinSum();
    }
  );
</script>

<style src="~/assets/styles/components/form/input/payments.scss" lang="scss" />
