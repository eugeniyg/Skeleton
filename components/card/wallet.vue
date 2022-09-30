<template>
  <div class="card-wallet" :class="{'is-active': isActive}">
    <div class="content">
      <div class="title">{{ currencyName }}</div>

      <form-input-toggle
        v-if="!isActive"
        name="toggle"
        :value="isChecked"
        @change="clickToggle"
      >
        {{ content?.changeButton }}
      </form-input-toggle>

      <div class="amount">
        <span class="amount">{{ balanceFormat.amount }}</span>
        <span class="currency">{{ balanceFormat.currency }}</span>
      </div>

      <button-base
        v-if="showHideCurrencyButton"
        class="hide-currency"
        type="ghost"
        size="xs"
        @click="hide"
      >
        {{ content?.hideButton }}
      </button-base>

      <div v-if="isActive" class="actions">
        <button-base type="primary" size="md" @click="openDepositModal">
          {{ content?.depositButton }}
        </button-base>

        <button-base type="secondary" size="md" @click="openWithdrawModal">
          {{  content?.withdrawButton }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ProfileWalletInterface } from '~/types';

  const props = defineProps<{
    id: string,
    balance: number,
    currency: string,
    status: number,
    content: ProfileWalletInterface
  }>();

  const isChecked = ref<boolean>(false);
  const { currencies } = useGlobalStore();
  const { openWithdrawModal, openDepositModal } = useLayoutStore();
  const { formatBalance } = useProjectMethods();
  const balanceFormat = computed(() => formatBalance(props.currency, props.balance));

  const isActive = computed(() => props.status === 1);
  const showHideCurrencyButton = computed(() => props.balance === 0 && !isActive.value);
  const currentCurrency = currencies.find((curr) => curr.code === props.currency);
  const currencyName = computed(() => `${currentCurrency.name} (${currentCurrency.code})`);

  const { switchAccount, hideAccount } = useWalletStore();

  const changeActive = async ():Promise<void> => {
    await switchAccount({
      accountId: props.id,
      currency: currentCurrency.code,
    });
    isChecked.value = false;
  };

  const clickToggle = ():void => {
    isChecked.value = true;
    setTimeout(() => {
      changeActive();
    }, 300);
  };

  const hide = async ():Promise<void> => {
    await hideAccount({
      accountId: props.id,
      currency: currentCurrency.code,
    });
  };
</script>

<style lang="scss">
.card-wallet {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  flex-basis: rem(334px);
  height: rem(199px);
  transition: padding .2s ease;
  padding: rem(2px);

  .title {
    @include font($body-2);
    color: var(--white);
    grid-area: title;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .label {
    flex-direction: row-reverse;
    @include font($body-1);
    color: var(--white);
    grid-area: label;
    position: relative;
  }

  .amount {
    grid-area: amount;
    @include font($heading-7);
    color: var(--white);
    grid-column-gap: rem(4px);
    display: flex;
    align-items: baseline;
    position: relative;
    margin: var(--margin, #{rem(48px)} 0 #{rem(8px)});

    .amount {
      --margin: 0;
    }
  }

  .currency {
    @include font($body-3);
    position: relative;
  }

  .content {
    position: relative;
    height: 100%;
    background: linear-gradient(107.86deg, #28263B 1.67%, #3D3D51 87.33%),
    linear-gradient(107.86deg, #19192F 1.67%, #28263B 87.33%);
    border-radius: inherit;
    padding: rem(26px);
    display: grid;
    grid-template-columns: 1fr minmax(0, auto);
    grid-template-areas:
      "title label"
      "amount amount"
      "actions actions";

    &:before {
      display: block;
      content: '';
      position: absolute;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA1OTggNTk3Ij48ZWxsaXBzZSBjeD0iMjk5LjIzNSIgY3k9IjI5OC44NjYiIGZpbGw9IiMwRTA5MUUiIG9wYWNpdHk9Ii4xNiIgcng9IjI5OC40NzkiIHJ5PSIyOTcuOTU2Ii8+PC9zdmc+);
      width: rem(596px);
      right: 0;
      top: 0;
      z-index: 0;
      bottom: 0;
      border-radius: 16px;
      background-position: right rem(-319px) top rem(-25px);
      background-repeat: no-repeat;
      background-size: rem(596px) rem(596px);
    }

  }

  &.is-active {
    padding: rem(2px);

    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(89.73deg, #FFDC8A 1.37%, #FFC12E 49.58%, #E6A409 98.17%);
    }

    .content {
      padding: rem(24px);
    }
  }

  .actions {
    display: flex;
    grid-column-gap: rem(8px);
    grid-area: actions;
    position: relative;
  }

  .hide-currency {
    color: var(--gray-300);
    transform: translateX(#{rem(-12px)});
  }
}

.cards-wallet {
  display: grid;
  grid-template-columns: var(--columns, 1fr);
  grid-gap: rem(16px);
  transition: all .2s ease;

  @include media(sm) {
    --columns: repeat(2, 1fr);
  }

  @include media(xl) {
    --columns: repeat(3, 1fr);
  }

  @include media(xxl) {
    --columns: repeat(4, 1fr);
  }
}
</style>
