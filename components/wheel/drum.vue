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
      :style="{ transform: `rotate(${currentRotationAngle}deg)` }"
    >
      <template v-for="(item, index) in segmentsList" :key="item.id">
        <div class="wheel-drum__segments-divider" :style="{ transform: `rotate(${index * -segmentGradAngle}deg)` }" />
        <div
          class="wheel-drum__segments-value"
          :style="{ transform: `translateY(-50%) rotate(${(index + 0.5) * -segmentGradAngle - 90}deg)` }"
        >
          <span class="wheel-drum__segments-label" :style="{ color: segmentLabelColor }">{{ item.title }}</span>
          <atomic-picture v-if="segmentImage" :src="segmentImage" not-lazy />
          <span v-if="item.dropRate" class="wheel-drum__segments-rate" :style="{ color: segmentRateColor }">
            {{ item.dropRate }}%
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWheelCommon, IWheelPage } from '~/types';
  import type { IWheel, IWheelSector } from '@skeleton/core/types/wheelsTypes';
  import BezierEasing from 'bezier-easing';

  const props = defineProps<{
    wheelData: IWheel;
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

  const segmentsList = props.wheelData.items || [];
  const getSegmentColor = (index: number): string => {
    if (segmentsList.length % 2 !== 0 && index === segmentsList.length - 1) return additionalBg;
    return index % 2 === 0 ? evenBg : oddBg;
  };

  const segmentsElement = useTemplateRef('segmentsElement');
  const segmentCount = segmentsList.length;
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

    segmentsList.forEach((segment, index) => {
      createSegment(index);
      canvasContext.rotate(segmentRadAngle);
    });

    segmentsElement.value?.append(canvasElement);
  };

  const activeWheel = ref(false);
  const currentRotationAngle = ref(0);

  const resetRotationData = (targetRelativeAngle: number): void => {
    currentRotationAngle.value = targetRelativeAngle;
    winningSector.value = undefined;
    activeWheel.value = false;
  };

  const createSpinError = (): void => {
    resetRotationData(0);
    const { showAlert } = useLayoutStore();
    const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
    showAlert(alertsData?.global?.somethingWrong || defaultLocaleAlertsData?.global?.somethingWrong);
  };

  const winningSector = ref<IWheelSector | undefined>();
  const spinRequest = async (): Promise<void> => {
    const { spinWheel } = useCoreWheelsApi();
    try {
      winningSector.value = await spinWheel(props.wheelData.id);
    } catch {
      activeWheel.value = false;
    }
  };

  const getWinningSectorIndex = (): number => {
    return segmentsList.findIndex(sector => sector.id === winningSector.value?.id);
  };

  const animateFinish = (): void => {
    if (!winningSector.value) return;
    const winningSectorIndex = getWinningSectorIndex();
    const targetRelativeAngle = getTargetAngle(winningSectorIndex);
    const fixedCurrentRotationAngle = currentRotationAngle.value;
    const currentRelativeAngle = currentRotationAngle.value % 360;
    const diff =
      targetRelativeAngle > currentRelativeAngle
        ? targetRelativeAngle - currentRelativeAngle
        : 360 - (currentRelativeAngle - targetRelativeAngle);
    const additionalRotation = diff + 360;
    const animationDuration = (additionalRotation / 360) * 2000; // Convert to milliseconds
    const startTime = performance.now();
    const linearToEase = BezierEasing(0.44, 0.7, 0.4, 0.95);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const rawProgress = Math.min(elapsed / animationDuration, 1); // Ensure progress doesn't exceed 1
      const easedProgress = linearToEase(rawProgress); // Linear for the rest
      currentRotationAngle.value = fixedCurrentRotationAngle + easedProgress * additionalRotation;

      if (!activeWheel.value) {
        return;
      } else if (easedProgress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        resetRotationData(targetRelativeAngle);
      }
    };

    window.requestAnimationFrame(animate);
  };

  const animateRegular = (): void => {
    const animationDuration = 300000; // Animation duration 5 minutes in ms
    const animationRotation = 260 * 360;
    const fixedCurrentRotationAngle = currentRotationAngle.value;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / animationDuration, 1); // Ensure progress doesn't exceed 1
      currentRotationAngle.value = fixedCurrentRotationAngle + progress * animationRotation;
      console.log('hello');

      if (!activeWheel.value) {
        createSpinError();
        return;
      } else if (winningSector.value) {
        animateFinish();
      } else if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else createSpinError();
    };

    window.requestAnimationFrame(animate);
  };

  const animateStart = (): void => {
    const animationDuration = 2000;
    const animationRotation = 360;
    const fixedCurrentRotationAngle = currentRotationAngle.value;
    const startTime = performance.now();
    const easeToLinear = BezierEasing(0.62, 0.01, 0.54, 0.24);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const rawProgress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeToLinear(rawProgress);
      currentRotationAngle.value = fixedCurrentRotationAngle + easedProgress * animationRotation;

      if (!activeWheel.value) {
        return;
      } else if (rawProgress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        spinRequest();
        animateRegular();
      }
    };

    window.requestAnimationFrame(animate);
  };

  const getTargetAngle = (index: number): number => {
    const sectorStartAngle = Math.ceil(index * segmentGradAngle);
    const sectorEndAngle = Math.floor(sectorStartAngle + segmentGradAngle);
    return getRandomInt(sectorStartAngle + 3, sectorEndAngle - 3);
  };

  const spinWheel = (): void => {
    if (activeWheel.value) return;
    activeWheel.value = true;
    animateStart();
  };

  onMounted(() => {
    initializeWheel();
  });

  onBeforeUnmount(() => {
    activeWheel.value = false;
  });
</script>

<style src="~/assets/styles/components/wheel/drum.scss" lang="scss" />
