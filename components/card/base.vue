<template>
  <div ref="cardBase" class="card-base" :class="{ hovered: gameHovered }" :data-size="cardSize" @click="clickGame">
    <atomic-image class="card-base__img" :src="src" />
    <Skeletor class="card-base__poster" as="div" />

    <div v-if="gameBages?.length" class="bages">
      <atomic-bage v-for="(bage, bageIndex) in gameBages" :key="bageIndex" v-bind="bage" />
    </div>

    <div v-if="!isMobile" class="card-base__info" @click.stop>
      <div class="card-base__info-titles">
        <div v-if="props.gameInfo?.name" class="card-base__info-title">{{ props.gameInfo.name }}</div>
        <div class="card-base__info-provider">{{ props.gameInfo?.provider.name }}</div>
      </div>

      <div class="card-base__info-actions">
        <button-play @click="openGame(true)" />
      </div>

      <div class="card-base__info-footer">
        <button-base v-if="props.gameInfo?.isDemoMode" class="btn-try" tag-name="span" @click="openGame(false)">
          Demo
        </button-base>

        <!--<button-info/>-->

        <client-only>
          <button-favorite v-if="isLoggedIn" :game-id="props.gameInfo?.id" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/api/types';
  import type { IGameTag } from '~/types';
  import { Skeletor } from 'vue-skeletor';
  import { getGameImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    gameInfo?: IGame;
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

  const labelNames = props.gameInfo?.labels?.map(label => label.name);
  const gameBages = gameTagsContent?.filter(bage => labelNames?.includes(bage.identity));

  const openGame = (isReal: boolean): void => {
    if (props.gameInfo?.identity === 'betsy-sportsbook-betsy') {
      router.push(localizePath('/betting'));
    } else if (!isReal) {
      router.push(localizePath(`/games/${props.gameInfo?.identity}`));
    } else if (!isLoggedIn.value) {
      openModal('sign-up');
    } else {
      router.push(localizePath(`/games/${props.gameInfo?.identity}?real=true`));
    }
  };

  const src = computed(() => getGameImageUrl(props.gameInfo?.customImages, props.gameInfo?.images, 'vertical'));
  const gameHovered = ref<boolean>(false);
  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const clickGame = async (): Promise<void> => {
    if (!props.gameInfo) return;

    if (props.gameInfo.identity === 'betsy-sportsbook-betsy') {
      await router.push(localizePath('/betting'));
    } else {
      const { openGame } = useMobileGameLogic(props.gameInfo);
      await openGame();
    }
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
