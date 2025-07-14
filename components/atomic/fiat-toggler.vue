<template>
  <div class="fiat-toggler">
    <div class="fiat-toggler__label" @click="toggle">
      {{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.fiatToggler') }}
    </div>

    <transition name="fade">
      <div v-if="equivalentCurrency" class="fiat-toggler__selected" @click="openModal('equivalent-currency')">
        <atomic-image
          class="fiat-toggler__selected-logo"
          :src="`/img/currency/${equivalentCurrency.code}.svg`"
          default-image="/img/currency/placeholder.svg"
        />
        <span class="fiat-toggler__selected-currency">{{ equivalentCurrency.code }}</span>
        <atomic-icon id="arrow_expand-close" />
      </div>
    </transition>

    <form-input-toggle :value="!!equivalentCurrency" name="fiat" @change="toggle" />
  </div>
</template>

<script setup lang="ts">
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { equivalentCurrency, layoutData, defaultLocaleLayoutData } = storeToRefs(globalStore);
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
