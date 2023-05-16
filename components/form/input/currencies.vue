<template>
  <div
    class="input-currencies"
    v-click-outside="close"
    :class="{ 'is-open': isOpen, 'has-error': props.showError }"
  >
    <div class="input-currencies__selected" @click.stop="toggleOpen" :class="{'is-disabled': !selectedItems.length}">
      <template v-if="!selectedCurrency?.name">
        <atomic-icon id="currency" class="input-currencies__selected-icon"/>
        <span class="input-currencies__selected-label">{{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.addCashLimit.chooseCurrencyLabel') }}</span>
      </template>
      <template v-else>
        <img
          class="input-currencies__selected-icon"
          :src="`/img/currency/${selectedCurrency?.code}.svg`"
          width="24"
          height="24"
          alt=""
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
          <img
            class="input-currencies__item-img"
            :src="`/img/currency/${currency.code}.svg`"
            width="24"
            height="24"
            alt=""
          />
          <span class="input-currencies__item-title">{{ currency.name }}</span>
          <span class="input-currencies__item-code">{{ formatBalance(currency.code, 0).currency }}</span>
        </div>
      </div>
    </div>

    <div class="input-currencies__error" v-if="props.showError">{{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.addCashLimit.chooseCurrencyError') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CurrencyInterface } from '@platform/frontend-core/dist/module';
  import { useWalletStore } from '~/composables/useWalletStore';
  import { useGlobalStore } from '~/composables/useGlobalStore';

  interface PropsInterface {
    showError: boolean,
    items: CurrencyInterface[]
  }

  const props = defineProps<PropsInterface>();

  const emit = defineEmits(['blur', 'select']);

  const walletStore = useWalletStore();
  const { currencyTabs } = storeToRefs(walletStore);
  const { formatBalance, getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData, defaultLocalePopupsData,
  } = storeToRefs(globalStore);

  const selected = ref<string>('all');
  const selectedCurrency = ref<CurrencyInterface|undefined>();
  const isOpen = ref<boolean>(false);

  const cryptoCurrencies = computed(() => props.items.filter((currency) => currency.type === 'crypto'));

  const selectedItems = computed(() => {
    const currencies = (selected.value === 'all' || !cryptoCurrencies.value.length) ? props.items : cryptoCurrencies.value;
    return currencies.filter((currency) => !currency.disabled);
  });

  const select = (id: string): void => {
    selected.value = id;
  };

  const selectCurrency = (currency: CurrencyInterface): void => {
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
</script>

<style lang="scss">
.input-currencies {
  position: relative;

  &.has-error {
    --error-display: block;
    --border-color: var(--red-800);
    --icon-color: var(--red-500);
  }

  &.is-open {
    --dropdown-display: block;
  }

  &__selected {
    display: flex;
    align-items: center;
    height: rem(40px);
    grid-column-gap: rem(8px);
    background-color: var(--bg, var(--gray-800));
    border: 1px solid var(--border-color, var(--gray-800));
    border-radius: 12px;
    padding: 8px 16px;
    user-select: none;

    &.is-disabled {
      --bg: var(--gray-800);
      --border-color: var(--gray-800);
      pointer-events: none;
    }

    .is-open & {
      --bg: var(--gray-700);
      --border-color: var(--gray-300);
    }

    &-label {
      @include font($body-2);
      color: var(--color, var(--white));
      flex-grow: 1;

      .is-disabled & {
        --color: var(--gray-500);
      }
    }

    &-icon {
      --color: var(--white);

      .is-disabled & {
        opacity: 0.4;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }

  &__expand-icon {
    transform: var(--icon-rotate, rotate(-180deg));
    transition: transform .2s ease-in-out;

    .is-disabled & {
      --icon-color: var(--gary-600);
    }

    .is-open & {
      --icon-rotate: rotate(0);
    }

    --color: var(--icon-color, var(--gray-400));
    --icon-size: 20px;
  }

  &__tabs {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    border-bottom: 1px solid var(--gray-700);
    padding-bottom: 8px;
  }

  &__tab {
    width: 100%;
    @include font($body-1);
    padding: 4px;
    text-align: center;
    color: var(--color, var(--white));
    background-color: var(--bg, transparent);
    border-radius: 8px;

    &:hover {
      cursor: pointer;
    }

    &.is-active {
      --color: var(--white);
      --bg: var(--gray-700);
    }
  }

  &__content {
    background-color: var(--gray-800);
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);
    display: var(--dropdown-display, none);
    position: absolute;
    border-radius: 8px;
    padding: 16px;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 2;
  }

  &__list {
    padding: 0;
    margin-top: 4px;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 4px;
    background-color: var(--item-bg);
    border-radius: 8px;
    cursor: pointer;

    &.is-active {
      --item-bg: var(--gray-900);
      --title-color: var(--yellow-500);
    }

    &-img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      display: block;
    }

    &-title {
      @include font($heading-1);
      color: var(--title-color, var(--white));
      margin-right: 4px;
    }

    &-code {
      @include font($body-0);
      color: var(--gray-400);
    }
  }

  &__error {
    @include font($body-0);
    color: var(--red-300);
    display: var(--error-display, none);
    margin-top: 4px;
  }
}
</style>
