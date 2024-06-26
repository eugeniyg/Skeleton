<template>
  <div
    class="quest-task"
    :class="taskStatusClasses">
    <div class="quest-task__img">
      <atomic-image :src="props.task?.image"/>
    </div>
    
    <div class="quest-task__header">
      <span v-if="props.task?.bundled" class="quest-task__bundled">
        <atomic-svg src="/img/quest/library.svg"/>
        <span class="quest-task__bundled-text">bundle</span>
      </span>
      <div
        v-if="realCurrencies || virtualCurrencies"
        class="quest-currencies"
      >
        <quest-currency :items="realCurrencies"/>
        <quest-currency :items="virtualCurrencies"/>
      </div>
      
      <quest-timer v-if="props.task?.expiredAt && props.showTimer" :expiredAt="props.task.expiredAt" />
    </div>
    
    <div class="quest-task__body">
      <div
        v-if="props.task?.numberTitle"
        class="quest-task__number">
        {{ props.task.numberTitle }}
      </div>
      
      <div class="quest-task__title">{{ props.task?.title }}</div>
      
      <quest-progress
        v-if="props.task?.progress && props.showProgressBar"
        v-bind="props.task.progress"
      />
    </div>
    
    <div v-if="displayInfo" class="quest-info-wrapper">
      <quest-info v-if="props.task?.multiplier" v-bind="props.task?.multiplier"/>
      <quest-info v-if="props.task?.win" v-bind="props.task.win"/>
      <quest-info v-if="props.task?.bet" v-bind="props.task.bet"/>
      <quest-games v-if="props.task?.games" :items="props.task.games"/>
      <quest-fields-to-complete v-if="props.task.fieldsToComplete" :items="props.task.fieldsToComplete"/>
    </div>
    
    <div v-if="props.showActions" class="quest-task__actions">
      <button-base v-if="isActive" size="xs" type="ghost">Cancel</button-base>
      <button-base v-else size="sm" type="primary" @click="isActive = true">Go</button-base>
    </div>
    
    <span v-if="props.showStatusIcon" class="quest-task__type-icon">
      <atomic-image :src="questPopupIconType"/>
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    task: {
      title: string;
      image: string;
      status?: 'active'|'expired'|'completed';
      numberTitle?: string;
      games?: string[];
      multiplier?: {
        min: number;
        max: number;
      },
      win?: {
        min: number;
        max: number;
      },
      bet?: {
        min: number;
        max: number;
      },
      expiredAt?: any;
      progress?: {
        width: number;
        title?: string;
        columns: number;
      };
      rewards?: {
        amount: number;
        currency: string;
        type: 'fiat'|'crypto'|'virtual';
      }[];
      fieldsToComplete?: string[];
      current?: boolean;
      bundled?: boolean;
    }
    
    bwEnabled?: boolean;
    showStatusIcon?: boolean;
    showActions?: boolean;
    showProgressBar?: boolean;
    showTimer?: boolean;
    iconType?: 'completed'|'next'|'locked';
  }>()
  
  const isActive = ref<boolean>(false);
  
  const realCurrencies = computed(() => {
    return props.task?.rewards?.filter(currency => currency.type !== 'virtual');
  });
  
  const virtualCurrencies = computed(() => {
    return props.task?.rewards?.filter(currency => currency.type === 'virtual');
  });
  
  const displayInfo = props.task?.multiplier || props.task?.win || props.task?.bet || props.task?.games || props.task?.fieldsToComplete;
  
  const orderTypeIcons = {
    'completed': '/img/quest/quest-completed-icon.png',
    'next': '/img/quest/quest-next-icon.png',
    'locked': '/img/quest/quest-locked-icon.png'
  }
  
  const questPopupIconType = computed(() => {
    return props.iconType && orderTypeIcons[props.iconType];
  });
  
  const taskStatusClasses = computed(() => ({
    'is-active': props.task?.status === 'active',
    'is-completed': props.task?.status === 'completed',
    'is-expired': props.task?.status === 'expired',
    'is-bw-enabled': props.bwEnabled,
  }));
  
</script>

<style src="~/assets/styles/components/quest/task.scss" lang="scss"/>
