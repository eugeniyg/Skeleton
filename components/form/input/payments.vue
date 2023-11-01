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
        :class="{'is-selected': item.method === props.activeMethod.method }"
        @click="select(item)"
      >
        <atomic-image v-if="item.method === cashAgentMethodKey" src="/img/methods-icons/cash-agent.svg" />
        <atomic-image v-else-if="defaultLogoUrl" class="mask" :src="defaultLogoUrl" />
        <div class="input-payments__min">min $200</div>
      </div>
    </div>
    <input type="hidden" name="payments" :value="props.activeMethod.method" />
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
      required: true,
    },
  });

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

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);

  const defaultLogoUrl = computed(() => {
    if (activeAccountType.value === 'fiat') return '/img/methods-icons/cards.svg';
    if (activeAccount.value?.currency) return `/img/methods-icons/${activeAccount.value?.currency}.svg`;
    return undefined;
  });

</script>

<style src="~/assets/styles/components/form/input/payments.scss" lang="scss" />

