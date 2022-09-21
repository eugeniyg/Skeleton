<template>
  <div
    class="input-payments"
    :class="classes"
  >
    <div v-if="props.items.length" class="selected" @click="open">
      <img
        v-if="props.activeMethod.logo || defaultLogoUrl()"
        class="mask"
        :src="props.activeMethod.logo || defaultLogoUrl()"
      />
      <atomic-icon id="arrow_expand-close"/>
    </div>

    <div class="items" v-if="props.items.length">
      <div
        class="item"
        v-for="(item, i) in props.items"
        :key="i"
        :class="{'is-selected': item.method === props.activeMethod.method }"
        @click="select(item)"
      >
        <img v-if="item.logo || defaultLogoUrl()" class="mask" :src="item.logo || defaultLogoUrl()" />
      </div>
    </div>
    <input type="hidden" name="payments" :value="props.activeMethod.method" />
  </div>
</template>

<script setup lang="ts">
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
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

  const classes = computed(() => [
    { 'is-open': isOpen.value },
  ]);

  const select = (method: PaymentMethodInterface):void => {
    emit('update:activeMethod', method);
    isOpen.value = false;
  };

  const open = ():void => {
    isOpen.value = !isOpen.value;
  };

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  const defaultLogoUrl = ():string => {
    if (activeAccountType.value === 'fiat') return '';
    if (activeAccount.value.currency === 'BTC') return '/img/bitcoin-logo.svg';
    if (activeAccount.value.currency === 'ETH') return '/img/ethereum-logo.svg';
    return '';
  };
</script>

<style lang="scss" src="./style.scss"/>
