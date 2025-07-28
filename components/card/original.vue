<template>
  <div
    ref="cardBase"
    v-click-outside="hideHover"
    class="card-original"
    :class="{
      hovered: gameHovered,
      'card-original--wide': props.isWide,
    }"
    :data-size="cardSize"
    @click="clickGame"
  >
    <atomic-image class="card-original__img" :src="src" />
    <div v-if="gameBages?.length" class="bages">
      <atomic-bage v-for="(bage, bageIndex) in gameBages" :key="bageIndex" v-bind="bage" />
    </div>

    <div class="card-original__info">
      <div class="card-original__info-titles">
        <div v-if="props.name" class="card-original__info-title">{{ props.name }}</div>
        <div class="card-original__info-provider">{{ props.provider.name }}</div>
      </div>

      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>

      <div class="card-original__info-actions">
        <button-play @click="openGame(true)" />
      </div>

      <div class="card-original__info-footer">
        <button-base v-if="props.isDemoMode" class="btn-try" tag-name="span" @click="openGame(false)">
          <!--{{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.demoButton') }}-->
          Demo
        </button-base>

        <!--<button-info/>-->

        <client-only>
          <button-favorite v-if="isLoggedIn" :game-id="id" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGameImages, IGameProvider, IGameLabel } from '@skeleton/api/types';
  import type { IGameTag } from '~/types';
  import { getGameImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    images?: IGameImages;
    customImages?: IGameImages;
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
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { openModal } = useModalStore();

  const gameTagsContent: Maybe<IGameTag[]> = getContent(
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    'gameTags.gameTagsList'
  );

  const labelNames = props.labels?.map(label => label.name);
  const gameBages = gameTagsContent?.filter(bage => labelNames.includes(bage.identity));

  const openGame = (isReal: boolean): void => {
    if (!isReal) {
      router.push(localizePath(`/games/${props.identity}`));
    } else if (!isLoggedIn.value) {
      openModal('sign-up');
    } else {
      router.push(localizePath(`/games/${props.identity}?real=true`));
    }
  };

  const src = computed(() => getGameImageUrl(props.customImages, props.images, 'vertical'));
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
