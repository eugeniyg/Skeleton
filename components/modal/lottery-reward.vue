<template>
  <vue-final-modal
    class="modal-lottery-reward"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('lottery-reward')" />
        
        <div class="title">
          <atomic-picture
            class="modal-lottery-reward__picture"
            :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')"
          />
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
        </div>
      </div>
      
      <ul v-if="items.length" class="modal-lottery-reward__items">
        <li v-for="(item, index) in items" class="modal-lottery-reward__item" :key="index">
          <div class="modal-lottery-reward__item-title">{{ item?.title }}</div>
          <div class="modal-lottery-reward__item-description">{{ item?.description }}</div>
        </li>
      </ul>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { ILotteryPage, IModalsContent } from '~/types';
  import { getContent } from '#imports';
  
  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['lotteryReward']>;
    defaultLocaleData: Maybe<IModalsContent['lotteryReward']>;
    lotteryIdentity: string;
  }>();
  
  const contentParams = {
    contentCollection: 'lotteries',
    where: ['pageIdentity', '=', props.lotteryIdentity],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ILotteryPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(`lottery-${props.lotteryIdentity}`, getContentData);
  
  const { closeModal } = useModalStore();
  
  const items = computed(() => {
    return getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'lotteryReward') || [];
  });
</script>

<style src="~/assets/styles/components/modal/lottery-reward.scss" lang="scss" />
