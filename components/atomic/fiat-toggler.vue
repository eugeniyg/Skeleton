<template>
  <div class="fiat-toggler">
    <div class="fiat-toggler__label" @click="toggle">
      {{ headerContent?.fiatToggler || defaultLocaleHeaderContent?.fiatToggler }}
    </div>

    <transition name="fade">
      <div v-if="equivalentCurrency" class="fiat-toggler__selected" @click="showModal('fiat')">
        <img class="fiat-toggler__selected-logo" :src="`/img/currency/${equivalentCurrency.code}.svg`" alt=""/>
        <span class="fiat-toggler__selected-currency">{{ equivalentCurrency.code }}</span>
      </div>
    </transition>

    <form-input-toggle
      :value="!!equivalentCurrency"
      @change="toggle"
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

<style src="~/assets/styles/components/atomic/fiat-toggler.scss" lang="scss" />
