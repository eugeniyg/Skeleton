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

      <button-play @click="openGame(true)"/>

      <button-base
        v-if="props.isDemoMode"
        class="btn-try"
        tag-name="span"
        type="secondary"
        size="xs"
        @click="openGame(false)"
      >
        {{ groupContent?.demoButton }}
      </button-base>

      <div class="info__provider">{{ props.provider.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PropType } from '@vue/runtime-core';
  import { GameImagesInterface, GameProviderInterface } from '@platform/frontend-core/dist/module';
  import { CardsGroupInterface } from '~/types';

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
  const { isLoggedIn, playerStatusName } = storeToRefs(profileStore);
  const { baseApiUrl, alertsData, globalComponentsContent } = useGlobalStore();
  const { showModal, showAlert } = useLayoutStore();
  const { localizePath, getImageUrl } = useProjectMethods();
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent?.cardsGroup;

  const gameBages = globalComponentsContent?.gameTags?.filter((bage) => props.labels.includes(bage.identity));

  const openGame = (isReal: boolean):void => {
    if (!isReal) {
      router.push(localizePath(`/games/${props.identity}`));
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else if (playerStatusName.value === 'Limited') {
      showAlert(alertsData?.limitedRealGame);
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
  --col-count: 3.3;
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

  @include media(sm) {
    --col-count: 6;
    --col-gap: 16px;
  }

  @include media(xl) {
    --col-count: 9;
  }

  .info {
    padding: var(--padding-info, #{rem(8px) rem(8px) 0});
    background-color: var(--bg-info, rgba(14, 9, 30, .8));
    display: var(--display, grid);
    grid-row-gap: 8px;
    position: var(--position-info, absolute);
    grid-template-areas:
      "title btn-favorite"
      "btn-play btn-play"
      "btn-try btn-try"
      "sub-title sub-title"
      "info__provider info__provider";
    grid-template-columns: 1fr rem(24px);
    grid-template-rows: 1fr auto auto 1fr;
    top: 0;
    left: -2px;
    right: -2px;
    bottom: 0;
    opacity: var(--opacity-info, 0);
    transition: var(--transition-info, (opacity .6s ease));
    pointer-events: var(--pointer-events, none);
    will-change: opacity;

    @include media(md) {
      padding: var(--padding-info, #{rem(16px) rem(12px) rem(8px)});
    }

    &__provider {
      @include font($body-0);
      @extend %text-elipsis;
      color: var(--gray-300);
      margin-top: auto;
      grid-column: 1/3;

      @include media(md) {
        @include font($body-1);
      }
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
    height: 40px;

    @media (min-width: 380px) {
      height: 50px;
    }

    @include media(sm) {
      @include upd-font($heading-2);
    }

    @include media(md) {
      height: 60px;
    }
  }

  .btn-favorite {
    grid-area: btn-favorite;
    position: relative;
    transform: translateY(#{rem(-2px)});
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
  }

  .btn-play {
    grid-area: btn-play;
    justify-self: center;
    transition: transform .2s ease-out;
    transform: scale(0);
    will-change: transform;
    margin-top: rem(-16px);

    display: block;
    --min-width: #{rem(48px)};
    --min-height: #{rem(48px)};

    @include media(sm) {
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
