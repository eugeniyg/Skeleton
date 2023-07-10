<template>
  <div
    ref="cardBase"
    class="card-base"
    :style="backgroundImage"
    :class="{ 'hovered': gameHovered }"
    :data-size="cardSize"
    @click="clickGame"
    v-click-outside="hideHover"
  >
    <div v-if="gameBages?.length" class="bages">
      <atomic-bage
        v-for="(bage, bageIndex) in gameBages"
        :key="bageIndex"
        v-bind="bage"
      />
    </div>

    <div class="card-base__info">
      <div class="card-base__info-titles">
        <div v-if="props.name" class="card-base__info-title">{{ props.name }}</div>
        <div class="card-base__info-provider">{{ props.provider.name }}</div>
      </div>

      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>

      <div class="card-base__info-actions">
        <button-play @click="openGame(true)"/>
      </div>

      <div class="card-base__info-footer">
        <button-base
          v-if="props.isDemoMode"
          class="btn-try"
          tag-name="span"
          @click="openGame(false)"
        >
          <!--{{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.demoButton') }}-->
          Demo
        </button-base>

        <!--<button-info/>-->

        <button-favorite v-if="isLoggedIn" :gameId="id"/>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PropType } from '@vue/runtime-core';
  import { GameImagesInterface, GameProviderInterface } from '@platform/frontend-core/dist/module';
  import { GameTagInterface } from '@skeleton/types';

  const props = defineProps({
    images: {
      type: Object as PropType<GameImagesInterface>,
      required: false,
    },
    name: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
      required: true,
    },
    isDemoMode: {
      type: Boolean,
      default: true,
    },
    subTitle: {
      type: String,
      default: '',
    },
    labels: {
      type: Array as PropType<{ name: string }[]>,
      default: () => [],
    },
    provider: {
      type: Object as PropType<GameProviderInterface>,
      required: true,
    },
  });

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const {
    baseApiUrl,
    alertsData,
    defaultLocaleAlertsData,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
  } = useGlobalStore();
  const { showModal, showAlert } = useLayoutStore();
  const { localizePath, getImageUrl, getContent } = useProjectMethods();

  const gameTagsContent: Maybe<GameTagInterface[]> = getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'gameTags');

  const labelNames = props.labels?.map((label) => label.name)
  const gameBages = gameTagsContent?.filter((bage) => labelNames.includes(bage.identity));

  const openGame = (isReal: boolean): void => {
    if (!isReal) {
      router.push(localizePath(`/games/${props.identity}`));
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else {
      router.push(localizePath(`/games/${props.identity}?real=true`));
    }
  };

  const backgroundImage = computed(() => {
    if (props.images?.hasOwnProperty('200x300')) {
      return `background-image:url(${baseApiUrl}/img/gcdn${getImageUrl(props.images, 'vertical')})`;
    }
    return 'background-image: none';
  });

  const gameHovered = ref<boolean>(false);
  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const clickGame = (): void => {
    if (isMobile.value) {
      gameHovered.value = !gameHovered.value;
    }
  };

  const hideHover = () => {
    if (gameHovered.value) gameHovered.value = false;
  };

  const cardBase = ref<HTMLElement>();
  const cardSize = ref<string>('');
  const timeoutId = ref();
  const cardSizes = [
    { size: 'min', min: 104, max: 127 },
    { size: 'def', min: 128, max: 167 },
    { size: 'max', min: 168, max: 200 },
  ];

  const setCardSize = () => {
    const width = cardBase.value?.getBoundingClientRect().width || 0;

    cardSize.value = cardSizes.reduce((acc, { size, min, max }) => {
      if (width > max) acc = 'max';
      if (width >= min && width <= max) acc = size;
      return acc;
    }, 'min');
  };

  const onResize = () => {
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(setCardSize, 200);
  };

  onMounted(() => {
    window.addEventListener('resize', onResize);
    setCardSize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });
</script>

<style src="~/assets/styles/components/card/base.scss" lang="scss" />
