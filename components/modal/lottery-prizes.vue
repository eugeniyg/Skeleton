<template>
  <vue-final-modal
    class="modal-lottery-prizes"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('lottery-prizes')" />
        
        <div class="title">
          <atomic-picture
            class="modal-lottery-prizes__picture"
            :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')"
          />
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
        </div>
      </div>
      
      <ul v-if="items.length" class="modal-lottery-prizes__items">
        <li v-for="(item, index) in items" class="modal-lottery-prizes__item" :key="index">
          <div class="modal-lottery-prizes__item-title">{{ item?.title }}</div>
          <div class="modal-lottery-prizes__item-description">{{ item?.description }}</div>
        </li>
      </ul>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';
  import { getContent } from '#imports';
  
  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['lotteryPrizes']>;
    defaultLocaleData: Maybe<IModalsContent['lotteryPrizes']>;
  }>();
  
  const { closeModal } = useModalStore();
  
  const items = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'items') || [];
  });
  
</script>

<style src="~/assets/styles/components/modal/lottery-prizes.scss" lang="scss" />
