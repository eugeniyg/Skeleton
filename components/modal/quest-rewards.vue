<template>
  <vue-final-modal
    v-model="showRewardsModal"
    class="modal-quest-rewards"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeRewardsModal"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeRewardsModal" />
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

  const questsStore = useQuestsStore();
  const { showRewardsModal, rewardsList, rewardsModalTitle } = storeToRefs(questsStore);
  const { closeRewardsModal } = questsStore;
</script>

<style src="~/assets/styles/components/modal/quest-rewards.scss" lang="scss" />
