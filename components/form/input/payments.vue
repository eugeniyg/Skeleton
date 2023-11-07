<template>
  <div
    class="input-payments"
    :class="classes"
    v-click-outside="close"
  >
    <div class="items" v-if="props.items.length">
      <div
        class="item"
        v-for="(item, i) in props.items"
        :key="i"
        :class="{'is-selected': item.method === props.activeMethod?.method }"
        @click="select(item)"
      >
        <atomic-image v-if="item.method === cashAgentMethodKey" src="/img/methods-icons/cash-agent.svg" />
        <atomic-image v-else-if="logoUrl" class="mask" :src="logoUrl" />
        <div class="input-payments__min">
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.methodMin') }}
          {{ methodsMinSum[i] }}
        </div>
      </div>
    </div>
    <input type="hidden" name="payments" :value="props.activeMethod?.method" />
  </div>
</template>

<script setup lang="ts">
  import { IPaymentMethod } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    activeMethod: {
      type: Object,
      required: false,
    },
  });

  const { getContent, formatBalance } = useProjectMethods();
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();

  const emit = defineEmits(['update:activeMethod']);
  const isOpen = ref<boolean>(false);
  const cashAgentMethodKey:string = '0x.withdrawal.cash_agent';

  const classes = computed(() => [
    { 'is-open': isOpen.value },
  ]);

  const select = (method: IPaymentMethod):void => {
    emit('update:activeMethod', method);
    isOpen.value = false;
  };

  const open = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    if (isOpen.value) isOpen.value = false;
  };

  const logoUrl = ref<string>('');
  const methodsMinSum = ref<string[]>([]);

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const checkLogoUrl = (): void => {
    if (activeAccountType.value === 'fiat') logoUrl.value = '/img/methods-icons/cards.svg';
    else if (activeAccount.value?.currency) logoUrl.value = `/img/methods-icons/${activeAccount.value?.currency}.svg`;
  }

  const getMinMethodSum = (minAmount: number): string => {
    const { amount, currency } = formatBalance(activeAccount.value?.currency, minAmount);
    return `${amount} ${currency}`;
  }

  const setMethodsMinSum = (): void => {
    methodsMinSum.value = props.items.map((method: any) => {
      return getMinMethodSum(method.amountMin);
    })
  }

  // FOR STATIC LOGO URL AND MIN DEPOSIT SUM
  // WITH REACTIVITY, THIS PARAMS UPDATE ASYNC BECAUSE OF REACTIVE activeAccount
  checkLogoUrl();
  setMethodsMinSum();

  watch(() => props.items, () => {
    checkLogoUrl();
    setMethodsMinSum();
  })
</script>

<style src="~/assets/styles/components/form/input/payments.scss" lang="scss" />

