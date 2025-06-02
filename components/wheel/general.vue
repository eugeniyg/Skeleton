<template>
  <div class="wheel-general">
    <button-base class="wheel-general__spin-button" type="primary" size="lg">
      <atomic-icon id="play" />
      <span>{{ spinLabel }}</span>
    </button-base>

    <wheel-drum
      :currentLocalePageContent="props.currentLocalePageContent"
      :defaultLocalePageContent="props.defaultLocalePageContent"
      :currentLocaleCommonContent="props.currentLocaleCommonContent"
      :defaultLocaleCommonContent="props.defaultLocaleCommonContent"
    />

    <wheel-board />
  </div>
</template>

<script setup lang="ts">
  import type { IWheelCommon, IWheelPage } from '~/types';

  const props = defineProps<{
    currentLocalePageContent: Maybe<IWheelPage>;
    defaultLocalePageContent: Maybe<IWheelPage>;
    currentLocaleCommonContent: Maybe<IWheelCommon>;
    defaultLocaleCommonContent: Maybe<IWheelCommon>;
  }>();

  const { getContent } = useProjectMethods();
  const spinLabel = getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spinButtonLabel');
</script>

<style src="~/assets/styles/components/wheel/general.scss" lang="scss" />
