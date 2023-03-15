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
  import { GameTagInterface } from '~/types';

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
      type: Array,
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

  const gameBages = gameTagsContent?.filter((bage) => props.labels.includes(bage.identity));

  const openGame = (isReal: boolean): void => {
    if (!isReal) {
      router.push(localizePath(`/games/${props.identity}`));
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else if (profile.value?.status === 2) {
      showAlert(alertsData?.limitedRealGame || defaultLocaleAlertsData?.limitedRealGame);
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

<style lang="scss">
.card-base {
  --col-count: 3.1;
  --col-gap: 8px;

  height: var(--height, auto);
  @include ratio(104px, 156px);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  background-color: var(--bg, rgba(black, 0.2));
  background-repeat: var(--bg-repeat, no-repeat);
  background-size: var(--bg-size, 100%);
  background-position: var(--bg-position, center);
  filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.16));
  border-radius: 8px;
  width: calc(calc(100% / var(--col-count)) - calc(var(--col-gap) - calc(var(--col-gap) / var(--col-count))));
  scroll-snap-align: start;

  @include media(sm) {
    --col-count: 6;
    --col-gap: 16px;
  }

  @include media(xl) {
    --col-count: 9;
  }

  &__info {
    padding: var(--card-info-padding, 8px);
    background-color: var(--bg-info, rgba(50, 6, 71, 0.8));
    display: var(--display, grid);
    position: var(--position-info, absolute);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: var(--opacity-info, 0);
    transition: var(--transition-info, (opacity .6s ease, padding .4s ease));
    pointer-events: var(--pointer-events, none);
    will-change: opacity;

    [data-size="min"] & {
      --card-info-padding: 8px;
    }

    [data-size="def"] & {
      --card-info-padding: 16px;
    }

    [data-size="max"] & {
      --card-info-padding: 24px;
    }

    &-titles {
      max-height: 41px;
    }

    &-title {
      @include font($heading-0);
      color: var(--color-info-title, var(--white));
      @include line-clamp(2);

      [data-size="min"] & {
        @include upd-font($heading-0);
      }

      [data-size="def"] & {
        @include upd-font($heading-2);
      }

      [data-size="max"] & {
        @include upd-font($heading-3);
      }
    }

    &-provider {
      @include font($body-0);
      @extend %text-elipsis;
      color: var(--gray-300);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: none;

      @include media(xs) {
        display: flex;
      }

      [data-size="min"] & {
        @include upd-font($body-0);
      }

      [data-size="def"] & {
        @include upd-font($body-0);
      }

      [data-size="max"] & {
        @include upd-font($body-1);
      }
    }

    &-actions {
      display: grid;
      align-self: center;
    }

    &-footer {
      display: flex;
      align-items: center;
      align-self: flex-end;
    }
  }

  @include media(md) {
    &:hover {
      --pointer-events: auto;
      --opacity-info: 1;
      --transition-info: (opacity .6s ease);

      .btn-play {
        transform: scale(1);
        transition-delay: .2s;
      }

      //.btn-try {
      //  animation: delay-pointer-events .2s ease-in-out;
      //}
    }
  }

  transition: transform .4s ease-in-out;
  transform: var(--y-offset, translateY(0));

  &.hovered {
    --pointer-events: auto;
    --opacity-info: 1;
    --transition-info: (opacity .6s ease);
    --y-offset: translateY(-16px);

    .btn-try {
      animation: delay-pointer-events .2s ease-in-out;
    }
  }

  img {
    width: var(--width, auto);
    height: var(--height, auto);
    display: var(--display, block);
  }

  .btn-try {
    display: flex;
    align-items: center;
    @include font($body-1);
    margin-left: -8px;
    margin-right: auto;
    background-color: var(--bgc, transparent);
    --padding: 4px 8px;
    --color: var(--violet-100);

    [data-size="max"] & {
      @include upd-font($heading-2);
    }

    @include use-hover {
      &:hover {
        transition: all .2s ease-in-out;
        --color: var(--yellow-500);
        --bgc: var(--violet-900);
      }
    }
  }

  @include use-hover {
    &:hover {
      --transition-info: (opacity .6s ease);
      --y-offset: translateY(-16px);
      --play-btn-opacity: 1;
    }
  }
}
</style>
