<template>
  <div v-if="isVisible && layoutData?.header?.pwa?.display" class="pwa" :class="{ '--mobile': isMobile }">
    <div v-if="isMobile" class="mobile-container">
      <atomic-icon :id="platformKey" />

      <div class="mobile-content">
        <div class="mobile-title">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.mobile.title') }}</div>
        <div class="mobile-description">
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.mobile.description') }}
        </div>
      </div>

      <button class="mobile-btn-install" @click="installPWA">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.mobile.install') }}
      </button>

      <div class="mobile-btn-close" @click="hideBanner">
        <atomic-icon id="close" />
      </div>
    </div>

    <div
      v-else
      ref="desktopContainer"
      class="desktop-container"
      @click="installPWA"
      @mouseover="showTooltip"
      @mouseleave="hideTooltip"
    >
      <atomic-icon :id="platformKey" />

      <div class="desktop-content">
        <div class="desktop-title">
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.desktop.application') }}
        </div>
        <div class="desktop-description">
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.desktop.forOs')?.replace('{os}', osPlatform) }}
        </div>
      </div>

      <Teleport v-if="isTooltipVisible" to="body">
        <div
          ref="tooltipContainer"
          class="desktop-tooltip-container"
          :style="`top: ${coords.top}px; left: ${coords.left}px`"
        >
          <div class="desktop-tooltip-bg">
            <atomic-picture
              :src="getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.tooltip.backgroundImage')"
            />
          </div>
          <div class="desktop-tooltip-content">
            <div class="desktop-tooltip-title">
              {{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.tooltip.title') }}
            </div>
            <div class="desktop-tooltip-description">
              {{ getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.tooltip.description') }}
            </div>
          </div>
          <div class="desktop-tooltip-image">
            <atomic-picture :src="getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.tooltip.image')" />
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UAParser } from 'ua-parser-js';

  const props = defineProps<{
    display: 'desktop' | 'mobile';
  }>();
  const PWA_HIDDEN_KEY = 'PWA_HIDDEN';

  const desktopContainer = ref<HTMLDivElement>();
  const tooltipContainer = ref<HTMLDivElement>();

  const globalStore = useGlobalStore();
  const { isMobile, osPlatform } = storeToRefs(globalStore);
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const isHidden = ref<boolean>(localStorage.getItem(PWA_HIDDEN_KEY) === 'true');
  const isTooltipVisible = ref<boolean>(false);
  const coords = reactive({
    top: 0,
    left: 0,
  });

  const userAgent = window.navigator.userAgent;
  const parsedUserAgent = userAgent ? UAParser(userAgent) : undefined;
  const appleNotCompatible = parsedUserAgent?.browser?.name === 'Safari' || parsedUserAgent?.os?.name === 'iOS';
  const allowInstall = ref<boolean>(!!window.pwa?.allowInstall || appleNotCompatible);
  const isVisible = computed(() => {
    return (
      allowInstall.value &&
      !isHidden.value &&
      ((props.display === 'desktop' && !isMobile.value) || (props.display === 'mobile' && isMobile.value))
    );
  });

  const platformKey = computed(() => {
    return (osPlatform.value as string).replaceAll(' ', '').toLowerCase();
  });

  onMounted(() => {
    if (window.pwa) {
      window.pwa.onInit(() => {
        allowInstall.value = !!window.pwa?.allowInstall;
      });
    }
  });

  const installPWA = () => {
    if (appleNotCompatible) {
      const { handleExternalLink } = useProjectMethods();
      hideBanner();
      const pageLink = getContent(layoutData, defaultLocaleLayoutData, 'header.pwa.instructionLink');
      handleExternalLink(pageLink);
    } else {
      window.pwa?.install().then(res => {
        if (res.outcome === 'accepted') {
          allowInstall.value = false;
        }
      });
    }
  };

  const hideBanner = () => {
    localStorage.setItem(PWA_HIDDEN_KEY, 'true');
    isHidden.value = true;
  };

  const setTooltipCoords = () => {
    const dRect = desktopContainer.value?.getBoundingClientRect();
    const tRect = tooltipContainer.value?.getBoundingClientRect();

    if (dRect && tRect) {
      coords.left = dRect.left - (tRect.width - dRect.width) / 2;
      coords.top = dRect.top + dRect.height;
    }
  };

  const showTooltip = () => {
    setTooltipCoords();
    isTooltipVisible.value = true;
  };

  const hideTooltip = () => {
    isTooltipVisible.value = false;
  };
</script>

<style src="~/assets/styles/components/pwa.scss" lang="scss" />
