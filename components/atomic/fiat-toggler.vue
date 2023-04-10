<template>
  <div class="fiat-toggler" @click="toggle">
    <div class="fiat-toggler__label">
      {{ headerContent?.fiatToggler || defaultLocaleHeaderContent?.fiatToggler }}
    </div>

    <transition name="fade">
      <div v-if="equivalentCurrency" class="fiat-toggler__selected" @click.stop="showModal('fiat')">
        <img class="fiat-toggler__selected-logo" :src="`/img/currency/${equivalentCurrency.code}.svg`" alt=""/>
        <span class="fiat-toggler__selected-currency">{{ equivalentCurrency.code }}</span>
      </div>
    </transition>

    <form-input-toggle
      :value="!!equivalentCurrency"
      name="fiat"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { showModal } = layoutStore;

  const globalStore = useGlobalStore();
  const { equivalentCurrency, headerContent, defaultLocaleHeaderContent } = storeToRefs(globalStore);
  const { setEquivalentCurrency, removeEquivalentCurrency } = globalStore;

  const toggle = () => {
    if (equivalentCurrency.value) {
      removeEquivalentCurrency();
    } else {
      setEquivalentCurrency('USD');
    }
  };
</script>

<style lang="scss">
.fiat-toggler {
  display: flex;
  align-items: center;
  padding-top: rem(16px);
  border-top: 1px solid var(--gray-700);
  margin-top: rem(8px);

  &__label {
    @include font($heading-1);
    @extend %text-elipsis;
    color: var(--white);
    flex-grow: 1;
  }

  &__selected {
    height: rem(24px);
    display: flex;
    align-items: center;
    column-gap: rem(4px);
    padding: 0 rem(8px);
    background-color: var(--layer-02);
    border-radius: 8px;
    margin-right: rem(4px);

    &-logo {
      display: block;
      @include box(16px);

    }

    &-currency {
      @include font($heading-1);
      color: var(--yellow-500);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
