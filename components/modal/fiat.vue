<template>
  <client-only>
    <vue-final-modal
      v-model="modals.fiat"
      class="modal-fiat"
      :click-to-close="false"
      :overlay-transition="{ mode: 'in-out', duration: 250 }"
      :content-transition="{ mode: 'in-out', duration: 250 }"
      @click-outside="closeModal('fiat')"
    >
      <div class="scroll">
        <div class="header">
          <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'balanceInFiat.title') }}</div>
          <button-modal-close @close="closeModal('fiat')" />
        </div>

        <p class="modal-fiat__text">
          {{ getContent(popupsData, defaultLocalePopupsData, 'balanceInFiat.description') }}
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
  </client-only>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;

  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData, equivalentCurrency, fiatCurrencies } = storeToRefs(globalStore);
  const { setEquivalentCurrency } = globalStore;
  const { getContent } = useProjectMethods();

  const selectFiat = (code: string) => {
    setEquivalentCurrency(code);
    closeModal('fiat');
  };
</script>

<style src="~/assets/styles/components/modal/fiat.scss" lang="scss" />
