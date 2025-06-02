<template>
  <div class="wheel-drum">
    <atomic-picture v-if="wheelImage" class="wheel-drum__wheel" :src="wheelImage" not-lazy />
    <atomic-picture v-if="wheelArrowImage" class="wheel-drum__arrow" :src="wheelArrowImage" not-lazy />

    <div class="wheel-drum__button">
      <span>
        {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spinButtonLabel') }}
      </span>

      <atomic-picture v-if="wheelButtonImage" :src="wheelButtonImage" not-lazy />
    </div>

    <div ref="segmentsElement" class="wheel-drum__segments">
      <template v-for="(item, index) in items" :key="item.id">
        <div class="wheel-drum__segments-divider" :style="{ transform: `rotate(${index * segmentGradAngle}deg)` }" />
        <div
          class="wheel-drum__segments-value"
          :style="{ transform: `translateY(-50%) rotate(${(index + 0.5) * segmentGradAngle - 90}deg)` }"
        >
          <span class="wheel-drum__segments-label" :style="{ color: segmentLabelColor }">{{ item.title }}</span>
          <atomic-picture v-if="segmentImage" :src="segmentImage" not-lazy />
          <span v-if="item.rate" class="wheel-drum__segments-label" :style="{ color: segmentRateColor }">
            {{ item.rate }}%
          </span>
        </div>
      </template>
    </div>
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
  const wheelImage = getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'wheelImage');
  const wheelArrowImage = getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'arrowImage');
  const wheelButtonImage = getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'buttonImage');
  const oddBg = getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'oddSectorColor');
  const evenBg = getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'evenSectorColor');
  const additionalBg = getContent(
    props.currentLocalePageContent,
    props.defaultLocalePageContent,
    'additionalSectorColor'
  );
  const segmentLabelColor = getContent(
    props.currentLocalePageContent,
    props.defaultLocalePageContent,
    'segmentLabelColor'
  );
  const segmentImage = getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'segmentImage');
  console.log(segmentImage);
  const segmentRateColor = getContent(
    props.currentLocalePageContent,
    props.defaultLocalePageContent,
    'segmentRateColor'
  );

  const items: { id: number; title: string; rate?: number }[] = [
    {
      id: 1,
      title: '100 FS',
      rate: 10,
    },
    {
      id: 2,
      title: 'Iphone 10 Pro',
      rate: 15,
    },
    {
      id: 3,
      title: '0.001 mBTC',
      rate: 60,
    },
  ];

  const getSegmentColor = (index: number): string => {
    if (items.length % 2 !== 0 && index === items.length - 1) return additionalBg;
    return index % 2 === 0 ? evenBg : oddBg;
  };

  const segmentsElement = useTemplateRef('segmentsElement');
  const segmentCount = items.length;
  const segmentGradAngle = 360 / segmentCount;

  const initializeWheel = (): void => {
    const containerSize = segmentsElement.value?.offsetWidth;
    if (!containerSize) return;
    const canvasElement = document.createElement('canvas');
    canvasElement.width = canvasElement.height = containerSize;
    const canvasContext = canvasElement.getContext('2d');
    if (!canvasContext) return;
    const wheelRadius = Math.floor(containerSize / 2);
    const segmentRadAngle = (2 * Math.PI) / segmentCount;
    canvasContext.translate(containerSize / 2, containerSize / 2);
    canvasContext.rotate(-Math.PI / 2);

    const createSegment = (index: number): void => {
      console.log(getSegmentColor(index));
      canvasContext.fillStyle = getSegmentColor(index);
      canvasContext.beginPath();
      canvasContext.moveTo(0, 0);
      canvasContext.lineTo(wheelRadius, 0);
      canvasContext.arc(0, 0, wheelRadius, 0, segmentRadAngle);
      canvasContext.closePath();
      canvasContext.fill();
    };

    items.forEach((segment, index) => {
      createSegment(index);
      canvasContext.rotate(segmentRadAngle);
    });

    segmentsElement.value?.append(canvasElement);
  };

  onMounted(() => {
    initializeWheel();
  });
</script>

<style src="~/assets/styles/components/wheel/drum.scss" lang="scss" />
