<template>
  <div
    class="card-base"
    :style="backgroundImage"
    :class="{ 'hovered': gameHovered }"
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

    <div class="info">
      <div v-if="props.name" class="title">{{ props.name }}</div>

      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>

      <button-favorite v-if="isLoggedIn" :gameId="id"/>

      <div class="info__actions">
        <button-play @click="openGame(true)"/>

        <button-base
          v-if="props.isDemoMode"
          class="btn-try"
          tag-name="span"
          type="secondary"
          size="xs"
          @click="openGame(false)"
        >
          {{ getContent(groupContent, defaultLocaleGroupContent, 'demoButton') }}
        </button-base>
      </div>

      <div class="info__provider">{{ props.provider.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PropType } from '@vue/runtime-core';
  import { GameImagesInterface, GameProviderInterface } from '@platform/frontend-core/dist/module';
  import { CardsGroupInterface, GameTagInterface } from '~/types';

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

  const groupContent: Maybe<CardsGroupInterface> = globalComponentsContent?.cardsGroup;
  const defaultLocaleGroupContent: Maybe<CardsGroupInterface> = defaultLocaleGlobalComponentsContent?.cardsGroup;

  const gameTagsContent: Maybe<GameTagInterface[]> = getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'gameTags');

  const gameBages = gameTagsContent?.filter((bage) => props.labels.includes(bage.identity));

  const openGame = (isReal: boolean):void => {
    if (!isReal) {
      router.push(localizePath(`/games/${props.identity}`));
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else if (profile.value?.status === 2) {
      showAlert(getContent(alertsData, defaultLocaleAlertsData, 'limitedRealGame'));
    } else {
      router.push(localizePath(`/games/${props.identity}?real=true`));
    }
  };

  const backgroundImage = computed(() => {
    if (props.images?.hasOwnProperty('200x300')) {
      return `background-image:url(${baseApiUrl}/img/gcdn${getImageUrl(props.images, 'vertical')})`;
    } return 'background-image: none';
  });

  const gameHovered = ref<boolean>(false);
  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const clickGame = ():void => {
    if (isMobile.value) {
      gameHovered.value = !gameHovered.value;
    }
  };

  const hideHover = () => {
    if (gameHovered.value) gameHovered.value = false;
  };
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
  width: calc(calc(100% / var(--col-count)) - calc(var(--col-gap) - calc(var(--col-gap)/var(--col-count))));
  scroll-snap-align: start;

  @include media(sm) {
    --col-count: 6;
    --col-gap: 16px;
  }

  @include media(xl) {
    --col-count: 9;
  }

  .info {
    padding: var(--padding-info, 8px);
    background-color: var(--bg-info, rgba(14, 9, 30, .8));
    display: var(--display, grid);
    position: var(--position-info, absolute);
    grid-template-areas:
      "title btn-favorite"
      "actions actions"
      "sub-title sub-title";
    grid-template-columns: 1fr rem(20px);
    grid-template-rows: auto 1fr auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-content: center;
    opacity: var(--opacity-info, 0);
    transition: var(--transition-info, (opacity .6s ease));
    pointer-events: var(--pointer-events, none);
    will-change: opacity;

    @include media(md) {
      padding: rem(16px);
    }

    &__provider {
      @include font($body-0);
      @extend %text-elipsis;
      color: var(--gray-300);
      margin-top: auto;
      grid-area: sub-title;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @include media(xs) {
        @include upd-font($body-1);
      }

      @include media(xs) {
        @include upd-font($body-0);
      }

      @include media(md) {
        @include upd-font($body-1);
      }

      @include media(xl) {
        @include upd-font($body-0);
      }

      @include media(xxl) {
        @include upd-font($body-1);
      }
    }

    &__actions {
      grid-area: actions;
      display: flex;
      flex-direction: column;
      align-self: center;
      justify-self: center;
      align-items: center;
      grid-gap: 8px;
      margin-bottom: 8px;
      margin-top: -6px;
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

      .btn-try {
        animation: delay-pointer-events .2s ease-in-out;
      }
    }
  }

  &.hovered {
    --pointer-events: auto;
    --opacity-info: 1;
    --transition-info: (opacity .6s ease);

    .btn-play {
      transform: scale(1);
      transition-delay: .2s;
    }

    .btn-try {
      animation: delay-pointer-events .2s ease-in-out;
    }
  }

  img {
    width: var(--width, auto);
    height: var(--height, auto);
    display: var(--display, block);
  }

  .title {
    @include font($heading-0);
    color: var(--color-info-title, var(--white));
    grid-area: title;
    height: 45px;

    @include media(xs) {
      @include upd-font($heading-2);
    }

    @include media(sm) {
      @include upd-font($heading-0);
    }

    @include media(md) {
      @include upd-font($heading-2);
    }

    @include media(xxl) {
      @include upd-font($heading-2);
    }
  }

  .btn-favorite {
    grid-area: btn-favorite;
    position: relative;
    transform: translateY(#{rem(-4px)});

    .icon {
      --icon-size: 20px;
    }
  }

  .sub-title {
    @include font($body-1);
    color: var(--color-info-sub-title, var(--gray-300));
    grid-area: sub-title;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .btn-try {
    --bg: var(--yellow-900);
    grid-area: btn-try;
    justify-self: center;
    white-space: nowrap;
    @include font($body-1);
    opacity: 1;
    height: 24px;
    --padding: 0 16px;
  }

  .btn-play {
    padding: 0;
    grid-area: btn-play;
    justify-self: center;
    transition: transform .2s ease-out;
    transform: scale(0);
    will-change: transform;
    display: flex;
    justify-content: center;
    align-items: center;

    --min-width: #{rem(48px)};
    --min-height: #{rem(48px)};

    @include media(md) {
      --min-width: #{rem(56px)};
      --min-height: #{rem(56px)};
    }
  }
}

@keyframes delay-pointer-events {
  0% {
    visibility: hidden;
    opacity: 0;
  }
  50% {
    visibility: hidden;
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}
</style>
