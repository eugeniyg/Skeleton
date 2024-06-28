<template>
  <vue-final-modal
    :modelValue="props.showModal"
    class="modal-quest-rewards"
    :clickToClose="false"
    @clickOutside="emit('closeModal')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')"/>
        <div class="title">
          {{ props.title }}
        </div>
      </div>

      <div class="modal-quest-rewards__content">
        <div class="modal-quest-rewards__item" v-for="item in rewardsList">
          <span class="modal-quest-rewards__amount">{{ item.amount }}</span>
          <span class="modal-quest-rewards__currency">{{ item.currency }}</span>
        </div>
      </div>

    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';

  const props = defineProps<{
    showModal: boolean;
    title?: string;
    rewardsList: { currency: string, amount: number }[];
  }>();

  const emit = defineEmits(['closeModal']);
</script>

<style src="~/assets/styles/components/modal/quest-rewards.scss" lang="scss" />