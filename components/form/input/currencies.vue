<template>
  <div
    class="input-currencies"
    v-click-outside="close"
    :class="{ 'is-open': isOpen, 'has-error': props.showError }"
  >
    <div class="input-currencies__selected" @click.stop="toggleOpen" :class="{'is-disabled': !selectedItems.length}">
      <template v-if="!selectedCurrency?.name">
        <atomic-icon id="currency" class="input-currencies__selected-icon"/>
        <span class="input-currencies__selected-label">{{ getContent(popupsData, defaultLocalePopupsData, 'addCashLimit.chooseCurrencyLabel') }}</span>
      </template>
      <template v-else>
        <atomic-image
          class="input-currencies__selected-icon"
          :src="`/img/currency/${selectedCurrency?.code}.svg`"
          defaultImage="/img/currency/placeholder.svg"
          width="24"
          height="24"
        />
        <span class="input-currencies__selected-label">{{ selectedCurrency?.name }}</span>
      </template>
      <atomic-icon id="arrow_expand-open" class="input-currencies__expand-icon"/>
    </div>

    <div class="input-currencies__content">
      <div class="input-currencies__tabs">
        <template v-if="cryptoCurrencies.length">
          <span
            class="input-currencies__tab"
            :class="{'is-active': selected === id}"
            v-for="{id, title} in currencyTabs"
            :key="id"
            :id="id"
            @click="select(id)"
          >
            {{ title }}
          </span>
        </template>
      </div>
      <div class="input-currencies__list">
        <div
          v-for="currency in selectedItems"
          :key="currency.code"
          class="input-currencies__item"
          :class="{'is-active': selectedCurrency?.name === currency.name}"
          @click="selectCurrency(currency)"
        >
          <atomic-image
            class="input-currencies__item-img"
            :src="`/img/currency/${currency.code}.svg`"
            defaultImage="/img/currency/placeholder.svg"
            width="24"
            height="24"
          />
          <span class="input-currencies__item-title">{{ currency.name }}</span>
          <span class="input-currencies__item-code">{{ formatBalance(currency.code, 0).currency }}</span>
        </div>
      </div>
    </div>

    <div class="input-currencies__error" v-if="props.showError">{{ getContent(popupsData, defaultLocalePopupsData, 'addCashLimit.chooseCurrencyError') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICurrency } from '@skeleton/core/types';

  interface IProps {
    showError: boolean,
    items: ICurrency[]
  }

  const props = defineProps<IProps>();

  const emit = defineEmits(['blur', 'select']);

  const walletStore = useWalletStore();
  const { currencyTabs } = storeToRefs(walletStore);
  const { formatBalance, getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData, defaultLocalePopupsData,
  } = storeToRefs(globalStore);

  const selected = ref<string>('all');
  const selectedCurrency = ref<ICurrency|undefined>();
  const isOpen = ref<boolean>(false);

  const cryptoCurrencies = computed(() => props.items.filter((currency) => currency.type === 'crypto'));

  const selectedItems = computed(() => {
    const currencies = (selected.value === 'all' || !cryptoCurrencies.value.length) ? props.items : cryptoCurrencies.value;
    return currencies.filter((currency) => !currency.disabled);
  });

  const select = (id: string): void => {
    selected.value = id;
  };

  const selectCurrency = (currency: ICurrency): void => {
    selectedCurrency.value = currency;
    isOpen.value = false;
    emit('select', currency);
  };

  const toggleOpen = (): void => {
    isOpen.value = !isOpen.value;
  };

  const close = (): void => {
    if (isOpen.value) {
      isOpen.value = false;
      if (!selectedCurrency.value?.name) emit('blur');
    }
  };

  onMounted(() => {
    selectedCurrency.value = undefined;
  });
</script>

<style src="~/assets/styles/components/form/input/currencies.scss" lang="scss" />
