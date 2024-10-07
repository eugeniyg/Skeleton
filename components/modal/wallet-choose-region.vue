<template>
  <vue-final-modal
    v-model="modals.walletRegion"
    class="modal-choose-region"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @clickOutside="closeModal('walletRegion')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('walletRegion')"/>
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
          @input="onInput"
        >
        <atomic-icon
          id="search"
          class="modal-choose-region__search-icon"
        />
      </div>

      <div class="modal-choose-region__items">
        <div
          v-for="country in countriesSelectOptions"
          :key="country.code"
          class="modal-choose-region__item"
          :class="{'is-selected': selectedRegion === country.code}"
          @click="selectRegion(country.code)"
        >
          <atomic-image :src="`/img/flags/${country.code}.svg`" />
          <div class="modal-choose-region__item-label">{{ country.name }}</div>
        </div>
      </div>

      <!-- IF EMPTY SEARCH RESULT
      <atomic-empty
        variant="bonuses"
        title="Sorry"
        subTitle="You have already added all</br> currencies"
      />
      -->

      <button-base
        type="primary"
        size="md"
        :is-disabled="!selectedRegion"
        @click="actionClick"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.regionModal.selectButton') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData, countriesSelectOptions } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const searchInput = ref<string>('');
  const selectedRegion = ref<string>('');

  const onInput = (e:any):void => {};

  const selectRegion = (item: any):void => {
    console.log(item);
    selectedRegion.value = item;
  }

  const actionClick = ():void => {
    closeModal('walletRegion');
  }
</script>

<style src="~/assets/styles/components/modal/wallet-choose-region.scss" lang="scss" />

