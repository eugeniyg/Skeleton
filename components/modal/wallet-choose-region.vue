<template>
  <vue-final-modal
    v-model="modals.chooseRegion"
    class="modal-choose-region"
    :clickToClose="false"
    @clickOutside="closeModal('chooseRegion')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('chooseRegion')"/>
        <div class="modal-choose-region__title">Choose a region</div>
      </div>

      <div class="modal-choose-region__search">
        <input
          class="modal-choose-region__search-input"
          v-model="searchInput"
          placeholder="Search your region"
          type="text"
          @input="onInput"
        >
        <atomic-icon
          class="modal-choose-region__search-icon"
          id="search"
        />
      </div>

      <div class="modal-choose-region__items">
        <div
          class="modal-choose-region__item"
          :class="{'is-selected': selectedRegion === item}"
          v-for="item in items"
          @click="selectRegion(item)"
        >
          <atomic-image src="/img/cash/logo.svg"/>
          <div class="modal-choose-region__item-label">{{ item }}</div>
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
        @click="actionClick"
        :is-disabled="!selectedRegion"
      >
        Apply
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
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const searchInput = ref<string>('');
  const selectedRegion = ref<string>('');

  const onInput = (e:any):void => {};

  const selectRegion = (item: any):void => {
    selectedRegion.value = item;
  }

  const actionClick = ():void => {
    closeModal('choose-region');
  }

  const items = [
    'Åland Islands',
    'Réunion',
    'New Zealand dollar',
    'Pakistan',
    'Saint Vincent and the Grenadines',
    'Georgia',
    'Åland Islands',
    'Réunion',
    'New Zealand dollar',
    'Pakistan',
    'Georgia',
  ]
</script>

<style src="~/assets/styles/components/modal/wallet-choose-region.scss" lang="scss" />

