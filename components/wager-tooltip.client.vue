<template>
  <div
    v-if="tooltipContent?.text && tooltipContent?.iconColor"
    class="wager-tooltip"
    ref="tooltip"
    :class="tooltipClasses"
    @mouseover="showTooltip"
  >
    <atomic-icon id="flash" class="wager-tooltip__icon" v-if="!props.isInline" />
    
    <div
      class="wager-tooltip__content"
      ref="tooltipContentContainer"
      :style="`left: ${coords.left}px; top: ${coords.top}px`"
    >
      <atomic-icon id="flash" class="wager-tooltip__icon"/>
      
      <div class="wager-tooltip__msg" v-html="marked.parse(tooltipContent?.text)"/>
      
      <span
        class="wager-tooltip__close"
        v-if="!props.isInline"
        @click="hideTooltip"
      >
        <atomic-icon id="close" class="wager-tooltip__close-icon"/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  
  const props = defineProps<{
    isInline?: boolean,
    container?: HTMLElement,
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
  
  let iconColor:string = '';
  let text:string = '';
  
  const tooltipContent = computed(() => {
    if (!isBonusWagering.value) {
      iconColor = 'orange';
      text = getContent(layoutData, defaultLocaleLayoutData, 'header.wagerTooltip.notInWagering');
    }
    
    if (isBonusWagering.value && minimumBonusWagerMultiplier.value < 1) {
      iconColor = 'orange';
      text = getContent(layoutData, defaultLocaleLayoutData, 'header.wagerTooltip.wagerMultiplierLessThan');
    }
    
    if (isBonusWagering.value && minimumBonusWagerMultiplier.value > 1) {
      iconColor = 'green';
      text = getContent(layoutData, defaultLocaleLayoutData, 'header.wagerTooltip.wagerMultiplierMoreThan')
    }
    
    return {
      iconColor,
      text: text?.replace('{minimumBonusWagerMultiplier}', String(minimumBonusWagerMultiplier.value))
    };
  });
  
  const tooltipClasses = computed(() => {
    return {
      [`--icon-${tooltipContent.value?.iconColor}`]: tooltipContent.value?.iconColor,
      '--is-show': isTooltipVisible.value,
      '--is-inline': props.isInline
    }
  });
  
  const setCords = () => {
    const tooltipRect = tooltip.value?.getBoundingClientRect();
    const tooltipContentRect = tooltipContentContainer.value?.getBoundingClientRect();
    const headerRect = props.container?.getBoundingClientRect();
    const gap = 8;

    if(tooltipContentRect && headerRect && tooltipRect && screen.orientation) {
      if  (screen.orientation.type === 'portrait-primary') {
        coords.left = (headerRect.width - tooltipContentRect.width) / 2;
        coords.top = (headerRect.height - gap);
      } else if (screen.orientation.type === 'landscape-primary') {
        coords.left = (headerRect.width - gap);
        coords.top = tooltipRect.top - (tooltipContentRect.height - tooltipRect.height) / 2;
      }
    }
  }
  
  const showTooltip = () => {
    isTooltipVisible.value = true;
    setCords();
  };
  
  const hideTooltip = () => {
    isTooltipVisible.value = false;
  };
  
  onMounted(() => {
    window.addEventListener('resize', hideTooltip);
    
    if (screen.orientation) {
      screen.orientation.addEventListener('change', hideTooltip);
    }
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', hideTooltip);
    screen.orientation.removeEventListener('change', hideTooltip);
  });
  
</script>

<style src="~/assets/styles/components/wager-tooltip.scss" lang="scss"/>