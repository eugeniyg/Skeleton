<template>
  <div class="wheel-drum" :class="{ 'wheel-drum--active': activeWheel, 'wheel-drum--disabled': props.disabledWheel }">
    <atomic-picture v-if="wheelImage" class="wheel-drum__wheel" :src="wheelImage" not-lazy />
    <atomic-picture v-if="wheelArrowImage" class="wheel-drum__arrow" :src="wheelArrowImage" not-lazy />

    <div class="wheel-drum__button" @click="spinWheel">
      <span>{{ spinButton?.label || 'spin' }}</span>
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
  import type { IAlert, IWheelCommon, IWheelPage } from '~/types';
  import type { IWheel, IWheelSector } from '@skeleton/core/types/wheelsTypes';
  import BezierEasing from 'bezier-easing';

  const props = defineProps<{
    wheelData: IWheel;
    disabledWheel: boolean;
    currentLocalePageContent: Maybe<IWheelPage>;
    defaultLocalePageContent: Maybe<IWheelPage>;
    currentLocaleCommonContent: Maybe<IWheelCommon>;
    defaultLocaleCommonContent: Maybe<IWheelCommon>;
  }>();

  const emit = defineEmits(['updateWheel']);
  const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { getContent, getRandomInt, localizePath } = useProjectMethods();
  const currentPlayerSpins = defineModel<IWheel['playerSpins']>('currentPlayerSpins', { required: true });

  const wheelImage = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'wheelImage')
  );
  const wheelArrowImage = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'arrowImage')
  );
  const wheelButtonImage = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'buttonImage')
  );
  const oddBg = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'oddSectorColor')
  );
  const evenBg = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'evenSectorColor')
  );
  const additionalBg = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'additionalSectorColor')
  );
  const segmentLabelColor = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'segmentLabelColor')
  );
  const segmentImage = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'segmentImage')
  );
  const segmentRateColor = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'segmentRateColor')
  );

  const spinButton = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'makeSpinButton')
  );

  const getSpinsButton = computed(() =>
    getContent(props.currentLocalePageContent, props.defaultLocalePageContent, 'getSpinsButton')
  );

  const segmentsList = props.wheelData.items || [];
  const getSegmentColor = (index: number): string => {
    if (segmentsList.length % 2 !== 0 && index === segmentsList.length - 1) return additionalBg.value;
    return index % 2 === 0 ? evenBg.value : oddBg.value;
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

    const oldCanvasElement = segmentsElement.value.querySelector('canvas');
    if (oldCanvasElement) oldCanvasElement.replaceWith(canvasElement);
    else segmentsElement.value?.append(canvasElement);
  };

  const activeWheel = ref(false);
  const currentRotationAngle = ref(0);

  const resetRotationData = (targetRelativeAngle: number): void => {
    currentRotationAngle.value = targetRelativeAngle;
    winningSector.value = undefined;
  };

  const { showAlert } = useLayoutStore();
  const createSpinError = (errorCode?: number | undefined): void => {
    activeWheel.value = false;
    if (errorCode && errorCode === 10003) {
      showAlert(alertsData?.wheel?.spinsExpired || defaultLocaleAlertsData?.wheel?.spinsExpired);
      emit('updateWheel');
    } else {
      showAlert(alertsData?.global?.somethingWrong || defaultLocaleAlertsData?.global?.somethingWrong);
    }
    showDelayedNotification();
  };

  const winningSector = ref<IWheelSector | undefined>();
  const spinRequest = async (): Promise<void> => {
    const { spinWheel } = useCoreWheelsApi();
    try {
      winningSector.value = await spinWheel(props.wheelData.id);
      currentPlayerSpins.value.shift();
    } catch (err: any) {
      createSpinError(err.data?.error?.code);
    }
  };

  const getWinningSectorIndex = (): number => {
    return segmentsList.findIndex(sector => sector.id === winningSector.value?.id);
  };

  const showDelayedNotification = (): void => {
    if (!delayedNotification.value.length) return;
    delayedNotification.value.forEach(notification => showAlert(notification));
    delayedNotification.value = [];
  };

  const { openModal, openWalletModal } = useModalStore();
  const showSpinResult = (): void => {
    const fixedWinningSector = winningSector.value;
    setTimeout(async () => {
      await openModal('wheel-reward', {
        props: { rewardInfo: fixedWinningSector, sectorImg: segmentImage.value },
      });
      if (currentPlayerSpins.value.length === 0) emit('updateWheel');
      activeWheel.value = false;
    }, 500);

    setTimeout(async () => {
      showDelayedNotification();
    }, 1000);
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
        resetRotationData(0);
        return;
      } else if (easedProgress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        showSpinResult();
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
    const randomDuration = getRandomInt(500, 1000);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / animationDuration, 1); // Ensure progress doesn't exceed 1
      currentRotationAngle.value = fixedCurrentRotationAngle + progress * animationRotation;

      if (!activeWheel.value) {
        resetRotationData(0);
        return;
      } else if (winningSector.value && elapsed > randomDuration) {
        animateFinish();
      } else if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        createSpinError();
        resetRotationData(0);
      }
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
        resetRotationData(0);
        return;
      } else if (rawProgress < 1) {
        window.requestAnimationFrame(animate);
      } else {
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

  const dayjs = useDayjs();
  const hasActiveSpin = (): boolean => {
    return currentPlayerSpins.value.some(
      spin => spin.expireAt === null || dayjs().utc().isSameOrBefore(dayjs(spin.expireAt).utc())
    );
  };

  const router = useRouter();
  const spinWheel = (): void => {
    if (activeWheel.value) return;
    if (!isLoggedIn.value) openModal('sign-in');
    else if (currentPlayerSpins.value.length) {
      if (!hasActiveSpin()) {
        emit('updateWheel');
        showAlert(alertsData?.wheel?.spinsExpired || defaultLocaleAlertsData?.wheel?.spinsExpired);
        return;
      }
      activeWheel.value = true;
      spinRequest();
      animateStart();
    } else if (getSpinsButton.value?.url) router.push(localizePath(getSpinsButton.value.url));
    else openWalletModal();
  };

  const delayedNotification = ref<IAlert[]>([]);
  const handleDelayedNotification = (data: IAlert): void => {
    if (!activeWheel.value) showAlert(data);
    else delayedNotification.value.push(data);
  };

  defineExpose({ spinWheel });

  onMounted(() => {
    initializeWheel();
    useListen('delayedNotification', handleDelayedNotification);
    window.addEventListener('resize', initializeWheel);
  });

  onBeforeUnmount(() => {
    activeWheel.value = false;
    useUnlisten('delayedNotification', handleDelayedNotification);
    window.removeEventListener('resize', initializeWheel);
    showDelayedNotification();
  });
</script>

<style src="~/assets/styles/components/wheel/drum.scss" lang="scss" />
