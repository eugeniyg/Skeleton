<template>
  <div class="balance">
    <div class="row">
      <div class="label">
        {{ props.withdraw ? depositContent?.balanceLabel : withdrawContent?.balanceLabel }}
      </div>

      <div v-if="props.withdraw" class="value">
        {{ balanceFormat.amount }} {{ balanceFormat.currency }}
      </div>

      <div
        v-else
        v-click-outside="closeSelect"
        class="select"
        :class="{'is-open': isSelectOpen}"
        @click="toggleSelect"
      >
        <span class="amount">
          <span>{{ balanceFormat.amount }}</span>
          <span>{{ balanceFormat.currency }}</span>
        </span>
        <atomic-icon class="icon-expand" id="arrow_expand-close"/>

        <list-currencies
          :is-open="isSelectOpen"
          hideBalance
          @hide-currencies-list="isSelectOpen = false"
          @click.stop.prevent
          @changeActiveAccount="walletStore.getDepositMethods"
        />
      </div>
    </div>

    <div class="row" v-if="props.withdraw">
      <div class="label">{{ withdrawContent?.withdrawLabel }}</div>
      <div class="value">
        {{ balanceFormat.amount }} {{ balanceFormat.currency }}
      </div>
    </div>
    <atomic-divider/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { DepositInterface, WithdrawInterface } from '~/types';

  const props = defineProps({
    withdraw: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const { popupsData } = useGlobalStore();
  const depositContent: DepositInterface | undefined = popupsData?.deposit;
  const withdrawContent: WithdrawInterface | undefined = popupsData?.withdraw;
  const { formatBalance } = useProjectMethods();
  const isSelectOpen = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));

  const toggleSelect = () => {
    isSelectOpen.value = !isSelectOpen.value;
  };

  const closeSelect = () => {
    if (isSelectOpen.value) isSelectOpen.value = false;
  };
</script>

<style lang="scss">
.balance {
  background-color: var(--black-primary);
  border-radius: 8px;
  padding: var(--items-padding, #{rem(16px)});
  margin: var(--margin, 0);
  align-items: flex-start;
  width: 100%;

  @include media(md) {
    min-width: 144px;
    border-radius: unset;
  }

  hr {
    display: var(--hr-display, none);
    margin: rem(16px) 0;

    @include media(md) {
      --hr-display: block;
    }
  }

  @include media(md) {
    --items-bg: transparent;
    --items-padding: 0;
  }

  .row {
    display: flex;
    align-items: center;

    @include media(md) {
      flex-direction: column;
      align-items: flex-start;
    }

    &:nth-of-type(even) {
      margin-bottom: rem(16px);

      .value {
        @include upd-font($body-2);
        --color: var(--white);
        text-align: right;

        @include media(md) {
          text-align: left;
        }
      }
    }

    &:nth-of-type(odd) {
      margin-bottom: rem(16px);

      .value {
        text-align: right;

        @include media(md) {
          text-align: left;
        }
      }
    }

    .amount {
      display: flex;
      align-items: center;
      color: var(--white);
      @include font($body-1);
      grid-column-gap: rem(4px);
      margin-right: 8px;
    }

    .select {
      display: flex;
      justify-content: flex-end;
      position: relative;
      padding: rem(6px) rem(8px) rem(6px) rem(16px);
      align-items: center;
      @include font($body-1);
      border-radius: 8px;
      transition: all 0.2s;

      @include media(md) {
        width: 100%;
        justify-content: space-between;
        background-color: var(--gray-800);
        border: 1px solid var(--gray-800);
        margin-top: 4px;
      }

      .icon-expand {
        --icon-size: 20px;
        --color: var(--gray-400);
      }

      &.is-open {
        background-color: var(--gray-700);

        @include media(md) {
          border: 1px solid var(--gray-300);
        }
      }

      @include use-hover {
        &:hover {
          cursor: pointer;
        }
      }

      &.is-open {
        .icon-expand {
          --icon-transform: rotate(-180deg);
          --color: var(--white);
        }
      }

      .list-currencies {
        right: 0;
        left: auto;
        min-width: 144px;
        width: 100%;
        top: calc(100% + 6px);
        transform: none;

        @include media(md) {
          right: auto;
          left: -1px;
          min-width: initial;
          width: calc(100% + 2px);
        }
      }
    }

    .icon-expand {
      transform: var(--icon-transform, rotate(0));
      transition: transform 0.2s ease-in-out;
      --color: var(--gray-400);
      --icon-size: 20px;
    }
  }

  .label {
    @include font($body-2);
    color: var(--gray-400);
    flex-grow: 1;
    margin: 0;
  }

  .value {
    @include font($body-2);
    color: var(--color, var(--white));
    flex-grow: 1;
    margin: 0;
  }

  .items {
    @include media(md) {
      position: relative;
      --items-visibility: visible
    }
  }

  .input-payments {
    .selected {
      @include media(md) {
        display: none;
      }
    }
  }
}
</style>
