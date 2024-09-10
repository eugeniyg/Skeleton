<template>
  <vue-final-modal
    v-model="modals.walletBonusDetails"
    class="modal-bonus-details"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @clickOutside="closeModal('walletBonusDetails')"
  >
    <div class="scroll">
      <div class="header">
        <div
          class="header__title"
          :class="{ 'header__title--large': !depositMoreInfoBonus?.bonusValue }"
        >
          {{ depositMoreInfoBonus?.name }}
        </div>

        <div v-if="depositMoreInfoBonus?.bonusValue" class="header__value">
          {{ depositMoreInfoBonus.bonusValue }}
        </div>

        <div class="header__row">
          <bonuses-badge-type :mode="depositMoreInfoBonus?.badgeType" />

          <bonuses-timer
            v-if="depositMoreInfoBonus?.expiredDate"
            :expiredAt="depositMoreInfoBonus.expiredDate"
            hideLabels
          />

          <bonuses-badge-status :status="depositMoreInfoBonus?.badgeStatus" />
        </div>

        <button-modal-close @close="closeModal('walletBonusDetails')"/>
      </div>

      <div v-if="depositMoreInfoBonus" class="modal-bonus-details__table">
        <bonuses-info-table
          :key="depositMoreInfoBonus.id"
          class="modal-bonus-details__dl"
          :bonusInfo="depositMoreInfoBonus"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';


  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
</script>

<style src="~/assets/styles/components/modal/bonus-details.scss" lang="scss" />

