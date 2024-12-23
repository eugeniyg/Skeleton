<template>
  <vue-final-modal
    class="modal-quest-rewards"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('quest-rewards')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('quest-rewards')" />
        <div class="title">
          {{ rewardsModalTitle }}
        </div>
      </div>

      <div class="modal-quest-rewards__content">
        <div v-for="(item, index) in rewardsList" :key="index" class="modal-quest-rewards__item">
          <span class="modal-quest-rewards__amount">{{ item.amount }}</span>
          <span class="modal-quest-rewards__currency">{{ item.currency }}</span>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';

  const { closeModal } = useModalStore();
  const questsStore = useQuestsStore();
  const { rewardsList, rewardsModalTitle } = storeToRefs(questsStore);
</script>

<style src="~/assets/styles/components/modal/quest-rewards.scss" lang="scss" />
