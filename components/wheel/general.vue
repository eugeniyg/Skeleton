<template>
  <div class="wheel-general">
    <div class="wheel-general__bg" />

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
          v-model:currentPlayerSpins="currentPlayerSpins"
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
  import type { IWheel } from '@skeleton/core/types/wheelsTypes';

  const props = defineProps<{
    wheelData: IWheel;
    currentLocalePageContent: Maybe<IWheelPage>;
    defaultLocalePageContent: Maybe<IWheelPage>;
    currentLocaleCommonContent: Maybe<IWheelCommon>;
    defaultLocaleCommonContent: Maybe<IWheelCommon>;
  }>();

  const emit = defineEmits(['updateWheel']);
  const wheelDrumComponent = useTemplateRef('wheelDrumComponent');
  const currentPlayerSpins = ref<IWheel['playerSpins']>(props.wheelData.playerSpins);

  watch(
    () => props.wheelData,
    newValue => {
      currentPlayerSpins.value = newValue.playerSpins;
    }
  );

  const handleSpin = () => {
    if (!wheelDrumComponent.value) return;
    wheelDrumComponent.value.spinWheel();
  };

  const { getContent } = useProjectMethods();
  const pageSubtitle = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'pageSubtitle')
  );

  const disabledWheel = computed(() => {
    // TODO: ADD LIMITS LOGIC (!spins.length and hasLimit)
    return props.wheelData.state === 2;
  });
</script>

<style src="~/assets/styles/components/wheel/general.scss" lang="scss" />
