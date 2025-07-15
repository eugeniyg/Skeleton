<template>
  <div class="wheel-general">
    <div class="wheel-general__bg" :style="{ background: pageBackground }" />

    <div class="wheel-general__head">
      <h1 class="wheel-general__title">{{ wheelData?.title }}</h1>
      <h2 class="wheel-general__subtitle">{{ pageSubtitle }}</h2>
    </div>

    <div class="wheel-general__body">
      <wheel-drum
        ref="wheelDrumComponent"
        v-bind="props"
        v-model:currentPlayerSpins="currentPlayerSpins"
        :disabledWheel="disabledWheel"
        @updateWheel="emit('updateWheel')"
      />

      <client-only>
        <wheel-board
          v-bind="props"
          :currentPlayerSpins="currentPlayerSpins"
          :disabledWheel="disabledWheel"
          @spinWheel="handleSpin"
          @updateWheel="emit('updateWheel')"
        />
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWheelCommon, IWheelPage } from '~/types';
  import type { IWheel } from '@skeleton/api/types';

  const props = defineProps<{
    wheelData: IWheel;
    currentLocalePageContent: Maybe<IWheelPage>;
    defaultLocalePageContent: Maybe<IWheelPage>;
    currentLocaleCommonContent: Maybe<IWheelCommon>;
    defaultLocaleCommonContent: Maybe<IWheelCommon>;
  }>();

  const emit = defineEmits(['updateWheel']);
  const wheelDrumComponent = useTemplateRef('wheelDrumComponent');
  const currentPlayerSpins = ref<IWheel['playerSpins']>([...props.wheelData.playerSpins]);

  watch(
    () => props.wheelData,
    newValue => {
      currentPlayerSpins.value = [...newValue.playerSpins];
    }
  );

  const handleSpin = () => {
    if (!wheelDrumComponent.value) return;
    wheelDrumComponent.value.spinWheel();
  };

  const pageSubtitle = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'pageSubtitle')
  );

  const disabledWheel = computed(() => {
    const scheduledWheel = props.wheelData.state === 2;
    const periodLimit = !!props.wheelData.limitRefreshAt && !props.wheelData.playerSpins.length;
    return scheduledWheel || periodLimit;
  });

  const gradientTopColor = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'backgroundGradient.topColor')
  );
  const gradientBottomColor = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'backgroundGradient.bottomColor')
  );

  const pageBackground = computed(() => {
    if (gradientTopColor.value && gradientBottomColor.value) {
      return `linear-gradient(${gradientTopColor.value}, ${gradientBottomColor.value} 70%)`;
    }
    return undefined;
  });
</script>

<style src="~/assets/styles/components/wheel/general.scss" lang="scss" />
