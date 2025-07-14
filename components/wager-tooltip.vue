<template>
  <div
    v-if="tooltipContent?.text && tooltipContent?.iconColor"
    ref="tooltip"
    class="wager-tooltip"
    :class="tooltipClasses"
    @mouseover="showTooltip"
  >
    <atomic-icon v-if="!props.isInline" id="flash" class="wager-tooltip__icon" />

    <div
      ref="tooltipContentContainer"
      class="wager-tooltip__content"
      :style="`left: ${coords.left}px; top: ${coords.top}px`"
    >
      <atomic-icon id="flash" class="wager-tooltip__icon" />

      <div
        class="wager-tooltip__msg"
        v-html="DOMPurify.sanitize(marked.parse(tooltipContent?.text || '') as string, { FORBID_TAGS: ['style'] })"
      />

      <span v-if="!props.isInline" class="wager-tooltip__close" @click="hideTooltip">
        <atomic-icon id="close" class="wager-tooltip__close-icon" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    isInline?: boolean;
    container?: HTMLElement;
  }>();

  const coords = reactive({
    top: 0,
    left: 0,
  });

  const gamesStore = useGamesStore();
  const { isBonusWagering, minimumBonusWagerMultiplier } = storeToRefs(gamesStore);
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const tooltip = ref<HTMLElement>();
  const tooltipContentContainer = ref<HTMLElement>();

  const isTooltipVisible = ref<boolean>(props.isInline);

  let iconColor: string = '';
  let text: string = '';
  const padding: number = 8;

  const tooltipContent = computed(() => {
    if (!isBonusWagering.value) {
      iconColor = 'orange';
      text = getContent(layoutData, defaultLocaleLayoutData, 'header.wagerTooltip.notInWagering');
    } else if (isBonusWagering.value && minimumBonusWagerMultiplier.value < 1) {
      iconColor = 'orange';
      text = getContent(layoutData, defaultLocaleLayoutData, 'header.wagerTooltip.wagerMultiplierLessThan');
    } else if (isBonusWagering.value && minimumBonusWagerMultiplier.value > 1) {
      iconColor = 'green';
      text = getContent(layoutData, defaultLocaleLayoutData, 'header.wagerTooltip.wagerMultiplierMoreThan');
    } else {
      iconColor = '';
      text = '';
    }

    return {
      iconColor,
      text: text?.replace('{minimumBonusWagerMultiplier}', String(minimumBonusWagerMultiplier.value)),
    };
  });

  const tooltipClasses = computed(() => {
    return {
      [`--icon-${tooltipContent.value?.iconColor}`]: tooltipContent.value?.iconColor,
      '--is-show': isTooltipVisible.value,
      '--is-inline': props.isInline,
    };
  });

  const setCords = () => {
    const tooltipRect = tooltip.value?.getBoundingClientRect();
    const tooltipContentRect = tooltipContentContainer.value?.getBoundingClientRect();
    const headerRect = props.container?.getBoundingClientRect();

    if (tooltipContentRect && headerRect && tooltipRect) {
      if (window.innerHeight > window.innerWidth) {
        coords.left = (headerRect.width - tooltipContentRect.width) / 2;
        coords.top = headerRect.height - padding;
      } else {
        coords.left = headerRect.width - padding;
        coords.top = tooltipRect.top - (tooltipContentRect?.height - tooltipRect.height) / 2;
      }
    }
  };

  const showTooltip = () => {
    setCords();
    isTooltipVisible.value = true;
  };

  const hideTooltip = () => {
    isTooltipVisible.value = false;
  };

  onMounted(() => {
    window.addEventListener('resize', hideTooltip);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', hideTooltip);
  });
</script>

<style src="~/assets/styles/components/wager-tooltip.scss" lang="scss" />
