<template>
  <vue-final-modal
    v-model="modals.walletRegion"
    class="modal-choose-region"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
    @clickOutside="closeModal('walletRegion')"
    @beforeOpen="beforeOpen"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('walletRegion')" />
        <div class="modal-choose-region__title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.regionModal.title') }}
        </div>
      </div>

      <div class="modal-choose-region__search">
        <input
          v-model="searchInput"
          class="modal-choose-region__search-input"
          :placeholder="getContent(popupsData, defaultLocalePopupsData, 'wallet.regionModal.searchPlaceholder')"
          type="text"
          @input="debounceSearch"
        >

        <atomic-icon
          id="search"
          class="modal-choose-region__search-icon"
        />
      </div>

      <div v-if="filteredList.length" class="modal-choose-region__items">
        <div
          v-for="country in filteredList"
          :key="country.code"
          class="modal-choose-region__item"
          :class="{
            'is-selected': selectedRegion === country.code,
            'is-active': selectedPaymentMethodsRegion === country.code
          }"
          @click="selectRegion(country.code)"
        >
          <atomic-image
            :src="`/img/flags/${country.code.toLowerCase()}.svg`"
            defaultImage="/img/flags/placeholder.png"
          />
          <div class="modal-choose-region__item-label">{{ country.name }}</div>
        </div>
      </div>

      <atomic-empty
        v-else
        variant="search"
        :title="getContent(popupsData, defaultLocalePopupsData, 'wallet.regionModal.empty.title')"
        :subTitle="getContent(popupsData, defaultLocalePopupsData, 'wallet.regionModal.empty.description')"
      />

      <button-base
        type="primary"
        size="md"
        :is-disabled="!selectedRegion || selectedPaymentMethodsRegion === selectedRegion || loading"
        @click="actionClick"
      >
        <atomic-spinner :is-shown="loading"/>
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.regionModal.selectButton') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import type {ICountry} from "@skeleton/core/types";
  import debounce from "lodash/debounce";

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData, countriesSelectOptions } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const walletStore = useWalletStore();
  const { selectedPaymentMethodsRegion } = storeToRefs(walletStore);

  const searchInput = ref<string>('');
  const selectedRegion = ref<Maybe<string>>('');
  const filteredList = ref<ICountry[]>(countriesSelectOptions.value);

  const debounceSearch = debounce((event: any): void => {
    if (!event.target.value) filteredList.value = countriesSelectOptions.value;
    else filteredList.value = countriesSelectOptions.value.filter(
      country => country.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }, 500, { leading: false });

  const selectRegion = (countryCode: string):void => {
    if (selectedRegion.value === countryCode || selectedPaymentMethodsRegion.value === countryCode) return;
    selectedRegion.value = countryCode;
  }

  const beforeOpen = (): void => {
    if (searchInput.value) {
      searchInput.value = '';
      filteredList.value = countriesSelectOptions.value;
    }
    selectedRegion.value = selectedPaymentMethodsRegion.value || '';
  }

  const loading = ref(false);
  const actionClick = async ():Promise<void> => {
    if (!selectedRegion.value || selectedPaymentMethodsRegion.value === selectedRegion.value) return;
    loading.value = true;
    localStorage.setItem('paymentGeo', selectedRegion.value);
    walletStore.setPaymentMethodsGeo();

    await Promise.allSettled([
      walletStore.getDepositMethods(),
      walletStore.getWithdrawMethods()
    ]);
    loading.value = false;
    closeModal('walletRegion');
  }
</script>

<style src="~/assets/styles/components/modal/wallet-choose-region.scss" lang="scss" />

