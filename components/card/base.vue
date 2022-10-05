<template>
  <div
    class="card-base"
    :style="backgroundImage"
    :class="[{ 'hovered': gameHovered }, `card-${props.id}`]"
    @click="clickGame"
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

      <client-only>
        <button-favorite v-if="isLoggedIn" :gameId="id"/>
      </client-only>

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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PropType } from '@vue/runtime-core';
  import { GameImagesInterface } from '@platform/frontend-core/dist/module';
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
      router.push(localizePath(`/games/${props.identity}?demo=true`));
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else if (playerStatusName.value === 'Limited') {
      showAlert(alertsData?.limitedRealGame);
    } else {
      router.push(localizePath(`/games/${props.identity}`));
    }
  };

  const backgroundImage = computed(() => {
    if (props.images.hasOwnProperty('200x300')) {
      return `background-image:url(${baseApiUrl}/img/gcdn${getImageUrl(props.images, 'vertical')})`;
    } return 'background-image: none';
  });

  const gameHovered = ref<string|undefined>(undefined);
  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const clickGame = ():void => {
    if (isMobile.value) {
      gameHovered.value = gameHovered.value === props.id ? undefined : props.id;
    }
  };

  const clickOutside = (e:any):void => {
    if (e.target.closest(`.card-${props.id}`)) return;
    gameHovered.value = undefined;
  };

  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
    setTimeout(() => {
      document.addEventListener('click', clickOutside);
    }, 100);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutside);
  });
</script>

<style lang="scss">
.card-base {
  height: var(--height, auto);
  padding: var(--padding, 1px);
  @include ratio(104px, 156px);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  background-color: var(--bg, transparent);
  background-repeat: var(--bg-repeat, no-repeat);
  background-size: var(--bg-size, 100%);
  background-position: var(--bg-position, center);
  min-width: var(--min-width, #{column(3)});
  @extend %cards-items;

  @include media(xs) {
    --min-width: #{column(4)};
  }

  @include media(sm) {
    --padding: 1px;
    --min-width: #{column(6)};
  }

  @include media(xl) {
    --min-width: #{column(9)};
  }

  .info {
    padding: var(--padding-info, #{rem(16px) rem(12px)});
    background-color: var(--bg-info, rgba(14, 9, 30, .8));
    display: var(--display, grid);
    grid-row-gap: 8px;
    position: var(--position-info, absolute);
    grid-template-areas:
      "title btn-favorite"
      "btn-play btn-play"
      "btn-try btn-try"
      "sub-title sub-title";
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
    height: 60px;

    @include media(sm) {
      @include upd-font($heading-2);
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

    --width: #{rem(48px)};
    --height: #{rem(48px)};

    @include media(sm) {
      --width: #{rem(56px)};
      --height: #{rem(56px)};
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
