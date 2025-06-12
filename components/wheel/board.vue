<template>
  <div class="wheel-board" :class="{ 'wheel-board--unavailable': props.disabledWheel }">
    <div class="wheel-board__container">
      <wheel-timer
        v-if="timerValue"
        :expiredAt="timerValue"
        :wheelData="props.wheelData"
        :currentLocaleContent="props.currentLocaleCommonContent"
        :defaultLocaleContent="props.defaultLocaleCommonContent"
        @timesUp="emit('updateWheel')"
      />

      <div class="wheel-board__spin">
        <div class="wheel-board__spin-label">{{ spinLabel }}</div>
        <div class="wheel-board__spin-count">{{ spinCountLabel }}</div>
        <div v-if="!isLoggedIn || props.wheelData.state === 2" class="wheel-board__spin-source">
          {{ spinSourceLabel }}
        </div>
      </div>

      <button-base type="primary" size="md" @click="handleClick">
        <atomic-icon :id="button.icon" /> {{ button.label }}
      </button-base>
    </div>

    <div class="wheel-board__hint">{{ hintLabel }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IWheel } from '@skeleton/core/types/wheelsTypes';
  import type { IWheelCommon, IWheelPage } from '~/types';

  const props = defineProps<{
    wheelData: IWheel;
    currentPlayerSpins: IWheel['playerSpins'];
    disabledWheel: boolean;
    currentLocalePageContent: Maybe<IWheelPage>;
    defaultLocalePageContent: Maybe<IWheelPage>;
    currentLocaleCommonContent: Maybe<IWheelCommon>;
    defaultLocaleCommonContent: Maybe<IWheelCommon>;
  }>();

  const emit = defineEmits(['spinWheel', 'updateWheel']);
  const { getContent } = useProjectMethods();
  const spinsScheduledLabel = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spins.spinsScheduledLabel')
  );
  const spinsActiveLabel = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spins.spinsActiveLabel')
  );
  const scheduledSpinsCount = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spins.scheduledSpinsCount')
  );
  const spinsLabel = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spinsLabel')
  );
  const spinSourceLabel = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'spinSourceLabel')
  );

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const spinLabel = computed(() => {
    if (!isLoggedIn.value || props.wheelData.state === 2) return spinsScheduledLabel.value;
    return spinsActiveLabel.value;
  });
  const spinCountLabel = computed(() => {
    if (!isLoggedIn.value || props.wheelData.state === 2) return scheduledSpinsCount.value;
    const spinsCount = props.currentPlayerSpins.length;
    return `${spinsCount} ${spinsLabel.value}`;
  });

  const makeSpinButton = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'makeSpinButton')
  );
  const unavailableSpinButton = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'unavailableSpinButton')
  );
  const getSpinsButton = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'getSpinsButton')
  );
  const button = computed(() => {
    if (!isLoggedIn.value || props.wheelData?.state === 2) return unavailableSpinButton.value;
    if (props.currentPlayerSpins.length) return makeSpinButton.value;
    return getSpinsButton.value;
  });

  const unauthorizedHintLabel = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'unauthorizedHintLabel')
  );
  const unavailableHintLabel = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'unavailableHintLabel')
  );
  const getSpinsHintLabel = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'getSpinsHintLabel')
  );
  const hintLabel = computed(() => {
    if (!isLoggedIn.value) return unauthorizedHintLabel.value;
    // TODO: ADD LIMIT LOGIC
    if (props.currentPlayerSpins.length) return getSpinsHintLabel.value;
    return unavailableHintLabel.value;
  });

  const handleClick = () => {
    emit('spinWheel');
  };

  const timerValue = computed(() => {
    // TODO: ADD LIMIT LOGIC
    if (props.wheelData.state === 2) return '2025-06-12';
    return null;
  });
</script>

<style src="~/assets/styles/components/wheel/board.scss" lang="scss" />
