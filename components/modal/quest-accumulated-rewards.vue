<template>
  <vue-final-modal
    v-model="modals.questAccumulatedRewards"
    class="modal-quest-accumulated-rewards"
    :clickToClose="false"
    @clickOutside="closeModal('questAccumulatedRewards')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('questAccumulatedRewards')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'questAccumulatedRewards.title') }}</div>
      </div>
      
      <div class="modal-quest-accumulated-rewards__content">
        <div class="modal-quest-accumulated-rewards__item" v-for="item in questAccumulatedRewards">
          <span class="modal-quest-accumulated-rewards__amount">{{ item.amount }}</span>
          <span class="modal-quest-accumulated-rewards__currency">{{ item.currency }}</span>
        </div>
      </div>
      
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
  
  const { questAccumulatedRewards } = useFakeStore();
</script>

<style src="~/assets/styles/components/modal/quest-accumulated-rewards.scss" lang="scss" />

