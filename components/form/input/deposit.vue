<template>
  <client-only>
    <div class="input-deposit">
      <div
        class="select"
        :class="{'is-open': isShow}"
        @click="toggleSelect"
        v-click-outside="closeDropdown"
      >
        <atomic-fiat-display v-if="isShowFiatDisplay"/>
        <div class="select__content" v-else>
          <div class="amount">{{ balanceFormat.amount }}</div>
          <div class="label">{{ balanceFormat.currency }}</div>
        </div>

        <atomic-icon class="icon-expand" id="arrow_expand-close"/>

        <list-currencies
          :is-open="isShow"
          show-fiat-toggler
          @hide-currencies-list="isShow = false"
          @click.stop
        />

      </div>
      <button-deposit/>
    </div>
  </client-only>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const { formatBalance } = useProjectMethods();
  const { activeAccount } = storeToRefs(walletStore);
  const layoutStore = useLayoutStore();
  const { showFiatDisplay } = layoutStore;
  const { isShowFiatDisplay } = storeToRefs(layoutStore);

  const isShow = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));

  const toggleSelect = () => {
    isShow.value = !isShow.value;
  };

  const closeDropdown = () => {
    if (isShow.value) isShow.value = false;
  };

  onMounted(() => {
    if (localStorage.getItem('SHOW_FIAT_DISPLAY')) {
      showFiatDisplay();
    }
  });
</script>

<style lang="scss">
.input-deposit {
  @include radius(12px);
  display: flex;
  background-color: var(--gray-900);
  color: var(--gray-500);
  user-select: none;
  position: relative;
  margin-left: -8px;
  width: fit-content;

  @include media(xs) {
    margin-left: 0;
  }

  .amount {
    @extend %flex-items-center;
    color: var(--white);
  }

  .label {
    @extend %flex-items-center;
  }

  .select {
    display: flex;
    position: relative;
    flex-shrink: 1;
    align-items: center;
    padding: 0 8px 0 16px;
    grid-column-gap: 4px;

    @include media(l) {
      padding: 0 16px;
    }

    &__content {
      display: grid;

      @include media(l) {
        display: flex;
      }

      .amount {
        @include font($heading-1);

        @include media(l) {
          @include upd-font($heading-2);
        }
      }

      .label {
        @include font($heading-0);
        order: -1;

        @include media(l) {
          margin: 0 0 0 rem(4px);
          @include upd-font($heading-2);
          order: 0;
        }
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
  }

  .icon-expand {
    transform: var(--icon-transform, rotate(0));
    transition: transform 0.2s ease-in-out;
    --color: var(--gray-400);
    --icon-size: 20px;
  }
}
</style>
