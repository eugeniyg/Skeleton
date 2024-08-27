<template>
  <vue-final-modal
    v-model="modals.bonusInfo"
    class="modal-bonus-info"
    :clickToClose="false"
    @clickOutside="closeModal('bonusInfo')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="modal-bonus-info__header">
        <div class="modal-bonus-info__header-title">30% bonus on Monday up to</div>
        <div class="modal-bonus-info__header-value">0.0035 mBTC</div>
        <atomic-image src="/img/uploads/bonus-info-img.png" class="modal-bonus-info__header-img"/>
        <div class="modal-bonus-info__header-row">
          <bonuses-badge-type mode="cash"/>
          <bonuses-timer expired-at="2025-08-20T09:25:51.331Z" hide-labels/>
          
          <bonuses-badge-status mode="active"/>
        </div>
        
        <button-modal-close @close="closeModal('bonusInfo')"/>
      </div>
      
      <bonuses-tabs/>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
</script>

<style src="~/assets/styles/components/modal/bonus-info.scss" lang="scss"/>

