<template>
  <client-only>
    <vue-final-modal
      v-model="modals.fiat"
      class="modal-fiat"
      :clickToClose="false"
      @clickOutside="closeModal('fiat')"
    >
      <div class="scroll">
        <div class="header">
          <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'displayInFiat.title') }}</div>
          <button-modal-close @close="closeModal('fiat')"/>
        </div>

        <p class="modal-fiat__text">
          {{ getContent(popupsData, defaultLocalePopupsData, 'displayInFiat.description') }}
        </p>

        <div class="modal-fiat__list">
          <div
            v-for="item in fiatCurrencies"
            class="modal-fiat__item"
            :class="{ 'is-active': equivalentCurrency.code === item.code }"
            :key="item.code"
            @click="selectFiat(item.code)"
          >
            <img class="modal-fiat__item-logo" :src="`/img/currency/${item.code}.svg`" alt=""/>
            <span class="modal-fiat__item-currency">{{ item.code }}</span>
          </div>
        </div>
      </div>
    </vue-final-modal>
  </client-only>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    equivalentCurrency,
    fiatCurrencies,
  } = storeToRefs(globalStore);
  const { setEquivalentCurrency } = globalStore;
  const { getContent } = useProjectMethods();

  const selectFiat = (code: string) => {
    setEquivalentCurrency(code);
    closeModal('fiat');
  };
</script>

<style lang="scss">
.modal-fiat {
  @extend %modal-info;

  .title {
    margin-bottom: rem(8px);
  }

  .scroll {
    grid-row-gap: 0;
    border-top-width: 8px;
    border-bottom-width: 8px;
  }

  .btn-modal-close {
    --top: -4px;
    --left: -16px;
  }

  &__item {
    background-color: var(--gray-800);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(6px) rem(16px);
    grid-column-gap: rem(4px);
    border-radius: 8px;
    color: var(--gray-300);
    transition: all .4s ease-in-out;

    &:hover {
      cursor: pointer;
      color: var(--yellow-500);
      background-color: var(--layer-02);
    }

    &.is-active {
      background-color: var(--gray-800);
      color: var(--yellow-500);
    }

    &-logo {
      @include box(20px);
      display: block;
    }

    &-currency {
      color: inherit;
    }
  }

  &__text {
    @include font($body-1);
    color: var(--gray-400);
    margin: 0 0 rem(24px);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: rem(8px);
  }
}
</style>
