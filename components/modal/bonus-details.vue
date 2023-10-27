<template>
  <vue-final-modal
    v-model="modals.bonusDetails"
    class="modal-bonus-details"
    :clickToClose="false"
    @clickOutside="closeModal('bonusDetails')"
  >
    <div class="modal-bonus-details__scroll">
      <div class="modal-bonus-details__header">
        <atomic-image class="img" src="/img/cash/gift.png" />
        <div class="modal-bonus-details__title">Bonus Details</div>
        <button-modal-close @close="closeModal('bonusDetails')"/>
      </div>
      
      <dl class="modal-bonus-details__dl">
        <template v-for="[dt, dd] in descriptionList">
          <dt>{{ dt }}</dt>
          <dd>{{ dd }}</dd>
        </template>
      </dl>
      
      <div class="modal-bonus-details__footnote" v-html="marked.parse(footnoteText)"/>
      
      <button-base type="ghost" size="xs">
        <span>Read more about Bonuses</span>
        <atomic-icon id="arrow_next"/>
      </button-base>
      
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  
  const descriptionList = [
    ['Min. Deposit', '$200'],
    ['Max. Bonus', '100%, max. $100'],
    ['Currency', 'All Currencies'],
    ['Wager', 'x35'],
    ['Min. bet for Wager', '$0.1'],
    ['Max. bet for Wager', '$10'],
  ];
  
  const footnoteText = "<p>* Wager in in-House Games is accrued with<br>a coefficient 0.2</p>";
  
</script>

<style src="~/assets/styles/components/modal/bonus-details.scss" lang="scss" />

