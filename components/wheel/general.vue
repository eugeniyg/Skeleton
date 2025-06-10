<template>
  <div class="wheel-general">
    <button-base class="wheel-general__spin-button" type="primary" size="lg" @click="handleSpin">
      <atomic-icon id="play" />
      <span>{{ buttonContent?.label || 'Spin' }}</span>
    </button-base>

    <wheel-drum ref="wheelDrumComponent" v-bind="props" />
    <client-only>
      <wheel-board v-bind="props" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import type { IWheelCommon, IWheelPage } from '~/types';
  import type { IWheel } from '@skeleton/core/types/wheelsTypes';

  const props = defineProps<{
    wheelData: IWheel;
    currentLocalePageContent: Maybe<IWheelPage>;
    defaultLocalePageContent: Maybe<IWheelPage>;
    currentLocaleCommonContent: Maybe<IWheelCommon>;
    defaultLocaleCommonContent: Maybe<IWheelCommon>;
  }>();

  const wheelDrumComponent = useTemplateRef('wheelDrumComponent');
  const { getContent } = useProjectMethods();
  const buttonContent = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'makeSpinButton')
  );

  const handleSpin = () => {
    if (!wheelDrumComponent.value) return;
    wheelDrumComponent.value.spinWheel();
  };
</script>

<style src="~/assets/styles/components/wheel/general.scss" lang="scss" />
