<template>
  <div class="wheel-drum" :class="{ 'wheel-drum--active': activeWheel }">
    <atomic-picture v-if="wheelImage" class="wheel-drum__wheel" :src="wheelImage" not-lazy />
    <atomic-picture v-if="wheelArrowImage" class="wheel-drum__arrow" :src="wheelArrowImage" not-lazy />

    <div class="wheel-drum__button" @click="spinWheel">
      <span>
        {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'spinButtonLabel') }}
      </span>

      <atomic-picture v-if="wheelButtonImage" :src="wheelButtonImage" not-lazy />
    </div>

    <div
      ref="segmentsElement"
      class="wheel-drum__segments"
      :style="{ transform: `rotate(${currentRotationAngle}deg)`, transition: rotateTransition }"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <div class="wheel-drum__segments-divider" :style="{ transform: `rotate(${index * -segmentGradAngle}deg)` }" />
        <div
          class="wheel-drum__segments-value"
          :style="{ transform: `translateY(-50%) rotate(${(index + 0.5) * -segmentGradAngle - 90}deg)` }"
        >
          <span class="wheel-drum__segments-label" :style="{ color: segmentLabelColor }">{{ item.title }}</span>
          <atomic-picture v-if="segmentImage" :src="segmentImage" not-lazy />
          <span v-if="item.rate" class="wheel-drum__segments-rate" :style="{ color: segmentRateColor }">
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

  const { getContent, getRandomInt } = useProjectMethods();
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
    {
      id: 4,
      title: '50 FS',
      rate: 25,
    },
    {
      id: 5,
      title: 'iPhone 16',
      rate: 12,
    },
    {
      id: 6,
      title: '0.010 mBTC',
      rate: 47,
    },
    {
      id: 7,
      title: '10 FS',
      rate: 99,
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
      canvasContext.fillStyle = getSegmentColor(index);
      canvasContext.beginPath();
      canvasContext.moveTo(0, 0);
      canvasContext.lineTo(wheelRadius - 2, 0);
      canvasContext.arc(0, 0, wheelRadius - 2, 0, segmentRadAngle);
      canvasContext.closePath();
      canvasContext.fill();
    };

    items.forEach((segment, index) => {
      createSegment(index);
      canvasContext.rotate(segmentRadAngle);
    });

    segmentsElement.value?.append(canvasElement);
  };

  const ROTATION_DEGREE_PER_SECOND = 360;
  const activeWheel = ref(false);
  const prevRotationAngle = ref(0);
  const currentRotationAngle = ref(0);
  const rotateTransition = ref('none');
  const wheelTimer = ref();
  const wheelDuration = ref(0);
  const lastTargetRelativeAngle = ref(0);

  const getCurrentRotationAngle = (): number => {
    if (!segmentsElement.value) return 0;
    const style = window.getComputedStyle(segmentsElement.value);
    const transform = style.transform;

    if (!transform || transform === 'none') return 0;

    const matrixValue = transform.match(/matrix\((.+)\)/);
    if (!matrixValue) return 0;
    const values = matrixValue[1].split(', ');
    const matrixFirstCord = parseFloat(values[0]);
    const matrixSecondCord = parseFloat(values[1]);
    const angle = Math.round(Math.atan2(matrixFirstCord, matrixSecondCord) * (180 / Math.PI));
    return angle < 0 ? angle + 360 : angle;
  };

  const resetTimer = ref();
  const resetRotationData = (targetRelativeAngle: number): void => {
    currentRotationAngle.value = targetRelativeAngle;
    prevRotationAngle.value = targetRelativeAngle;
    lastTargetRelativeAngle.value = targetRelativeAngle;
    wheelDuration.value = 0;
    clearTimeout(wheelTimer.value);
    rotateTransition.value = 'none';
    activeWheel.value = false;
  };

  const setWheelValue = async (index: number): Promise<void> => {
    console.log(index);
    clearTimeout(wheelTimer.value);
    const sectorStartAngle = Math.ceil(index * segmentGradAngle);
    const sectorEndAngle = Math.floor(sectorStartAngle + segmentGradAngle);
    const targetRelativeAngle = getRandomInt(sectorStartAngle + 3, sectorEndAngle - 3);
    const currentRelativeAngle = getCurrentRotationAngle();
    const diffCurrentLastTarget =
      currentRelativeAngle > lastTargetRelativeAngle.value
        ? currentRelativeAngle - lastTargetRelativeAngle.value
        : 360 - (lastTargetRelativeAngle.value - currentRelativeAngle);
    const diffCurrentTarget =
      targetRelativeAngle > currentRelativeAngle
        ? targetRelativeAngle - currentRelativeAngle
        : 360 - (currentRelativeAngle - targetRelativeAngle);

    const additionalRotation = 2 * ROTATION_DEGREE_PER_SECOND + diffCurrentTarget;
    const animationTime = (additionalRotation / ROTATION_DEGREE_PER_SECOND) * 1.25;
    currentRotationAngle.value =
      prevRotationAngle.value +
      wheelDuration.value * ROTATION_DEGREE_PER_SECOND +
      diffCurrentLastTarget +
      additionalRotation;
    rotateTransition.value = `transform ${animationTime}s ease-out`;
    resetTimer.value = setTimeout(() => {
      resetRotationData(targetRelativeAngle);
    }, animationTime * 1000);
  };

  const setDurationTimer = (): void => {
    wheelTimer.value = setTimeout(() => {
      wheelDuration.value += 1;

      if (wheelDuration.value === 2) {
        currentRotationAngle.value = currentRotationAngle.value + 300 * ROTATION_DEGREE_PER_SECOND;
        rotateTransition.value = 'transform 300s linear';
      }

      setDurationTimer();
    }, 1000);
  };

  const spinWheel = (): void => {
    if (activeWheel.value) return;
    activeWheel.value = true;
    currentRotationAngle.value = currentRotationAngle.value + 2 * ROTATION_DEGREE_PER_SECOND;
    rotateTransition.value = 'transform 2s cubic-bezier( 0.32, 0, 0.38, 0.47 )';
    setDurationTimer();

    setTimeout(() => {
      setWheelValue(getRandomInt(0, 7));
    }, 3000);
  };

  onMounted(() => {
    initializeWheel();
  });

  onBeforeUnmount(() => {
    clearTimeout(wheelTimer.value);
    clearTimeout(resetTimer.value);
  });
</script>

<style src="~/assets/styles/components/wheel/drum.scss" lang="scss" />
