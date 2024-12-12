<template>
  <vue-final-modal
    class="modal-fiat"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('equivalent-currency')"
  >
    <div class="scroll">
      <div class="header">
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
        <button-modal-close @close="closeModal('equivalent-currency')" />
      </div>

      <p class="modal-fiat__text">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}
      </p>

      <div class="modal-fiat__list">
        <div
          v-for="item in fiatCurrencies"
          :key="item.code"
          class="modal-fiat__item"
          :class="{ 'is-active': equivalentCurrency?.code === item.code }"
          @click="selectFiat(item.code)"
        >
          <atomic-image
            class="modal-fiat__item-logo"
            :src="`/img/currency/${item.code}.svg`"
            default-image="/img/currency/placeholder.svg"
          />
          <span class="modal-fiat__item-currency">{{ item.code }}</span>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['equivalentCurrency']>;
    defaultLocaleData: Maybe<IModalsContent['equivalentCurrency']>;
  }>();

  const { closeModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { equivalentCurrency, fiatCurrencies } = storeToRefs(globalStore);
  const { setEquivalentCurrency } = globalStore;
  const { getContent } = useProjectMethods();

  const selectFiat = (code: string) => {
    setEquivalentCurrency(code);
    closeModal('equivalent-currency');
  };
</script>

<style src="~/assets/styles/components/modal/equivalent-currency.scss" lang="scss" />
