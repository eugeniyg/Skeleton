<template>
  <div
    ref="cardBase"
    class="card-original"
    :class="{
      'hovered': gameHovered,
      'card-original--wide': props.isWide
    }"
    :data-size="cardSize"
    @click="clickGame"
    v-click-outside="hideHover"
  >
    <atomic-image class="card-original__img" :src="src" />
    <div v-if="gameBages?.length" class="bages">
      <atomic-bage
        v-for="(bage, bageIndex) in gameBages"
        :key="bageIndex"
        v-bind="bage"
      />
    </div>

    <div class="card-original__info">
      <div class="card-original__info-titles">
        <div v-if="props.name" class="card-original__info-title">{{ props.name }}</div>
        <div class="card-original__info-provider">{{ props.provider.name }}</div>
      </div>

      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>

      <div class="card-original__info-actions">
        <button-play @click="openGame(true)"/>
      </div>

      <div class="card-original__info-footer">
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
  import type { IGameImages, IGameProvider, IGameLabel } from '@skeleton/core/types';
  import type { IGameTag } from '~/types';

  const props = defineProps<{
    images?: IGameImages;
    name?: string;
    id: string;
    identity: string;
    isDemoMode: boolean;
    subTitle?: string;
    labels: IGameLabel[];
    provider: IGameProvider;
    isWide: boolean;
  }>();

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

  const gameTagsContent: Maybe<IGameTag[]> = getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'gameTags.gameTagsList');

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

  const src = computed(() => {
    if (props.images?.hasOwnProperty('200x300')) {
      return getImageUrl(props.images, 'vertical');
    }
    return '';
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

<style src="~/assets/styles/components/card/original.scss" lang="scss" />
