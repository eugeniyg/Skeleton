<template>
  <div class="balance">
    <div class="row">
      <div class="label">
        {{ props.withdraw ? depositContent?.balanceLabel : withdrawContent?.balanceLabel }}
      </div>

      <!--      <div class="value">-->
      <!--        {{ balanceFormat.amount }} {{ balanceFormat.currency }}-->
      <!--      </div>-->

      <div
        id="currencies-select"
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
          @hide-currencies-list="isSelectOpen = false"
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

  const clickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (isSelectOpen.value && !target.closest('#currencies-select')) {
      isSelectOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', clickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', clickOutside);
  });
</script>

<style lang="scss">
.balance {
  background-color: var(--black-primary);
  padding: var(--items-padding, #{rem(16px)});
  margin: var(--margin, 0);
  align-items: flex-start;
  width: 100%;

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
    display: grid;
    grid-row-gap: rem(8px);
    grid-template-columns: repeat(2, 1fr);

    @include media(md) {
      grid-row-gap: rem(2px);
      grid-template-columns: unset;
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
    }

    .select {
      display: flex;
      position: relative;
      padding: rem(6px) rem(8px) rem(6px) rem(16px);
      flex-shrink: 1;
      align-items: center;
      @include font($body-1);
      grid-column-gap: rem(8px);
      border-radius: 8px;
      background-color: var(--bg, transparent);
      justify-self: flex-end;
      margin-left: -16px;

      &.is-open {
        --bg: var(--gray-700);
      }

      .icon-expand {
        --icon-size: 20px;
        --color: var(--gray-400);
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
        transform: translateX(calc(-50% - #{rem(40px)})) translateY(#{rem(36px)});

        @include media(md) {
          transform: translateX(calc(-50% + #{rem(40px)})) translateY(#{rem(36px)});
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
