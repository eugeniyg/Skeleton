<template>
  <vue-final-modal
    v-model="modals.walletBonusDetails"
    class="modal-wallet-bonus-details"
    :clickToClose="false"
    @clickOutside="closeModal('walletBonusDetails')"
  >
    <div class="modal-wallet-bonus-details__scroll">
      <div class="modal-wallet-bonus-details__header">
        <atomic-image
          v-if="titleImage"
          class="img"
          :src="titleImage"
        />

        <div class="modal-wallet-bonus-details__title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.title') }}
        </div>

        <button-modal-close @close="closeModal('walletBonusDetails')"/>
      </div>

      <dl class="modal-wallet-bonus-details__dl">
        <template v-for="[dt, dd] in descriptionList">
          <dt>{{ dt }}</dt>
          <dd>{{ dd }}</dd>
        </template>
      </dl>

      <button-base type="ghost" size="xs">
        <span>
          {{ getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.readMore') }}
        </span>

        <atomic-icon id="arrow_next"/>
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const { getContent } = useProjectMethods();
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;

  const titleImage = computed(() => {
    return getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.titleImage')
  })

  const descriptionList = [
    ['Min. Deposit', '$200'],
    ['Max. Bonus', '100%, max. $100'],
    ['Currency', 'All Currencies'],
    ['Wager', 'x35'],
    ['Min. bet for Wager', '$0.1'],
    ['Max. bet for Wager', '$10'],
  ];
</script>

<style src="~/assets/styles/components/modal/wallet-bonus-details.scss" lang="scss" />

