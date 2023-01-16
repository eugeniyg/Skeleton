<template>
  <div class="card" @click="openGame">
    <div class="img" :style="backgroundImage"/>
    <div class="title">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from '@vue/runtime-core';
  import { GameImagesInterface } from '@platform/frontend-core/dist/module';

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
  });

  const { baseApiUrl } = useGlobalStore();
  const { getImageUrl, localizePath } = useProjectMethods();
  const backgroundImage = computed(() => {
    if (props.images?.hasOwnProperty('200x200')) {
      return `background-image: url(${baseApiUrl}/img/gcdn${getImageUrl(props.images, 'square')})`;
    } return 'background-image: url(/img/default-game-tumb.png)';
  });

  const router = useRouter();
  const openGame = ():void => {
    router.push(localizePath(`/games/${props.identity}?real=true`));
  };
</script>

<style lang="scss">
.card {
  flex-shrink: 0;
  width: var(--width, 25%);
  height: var(--height, auto);
  align-items: flex-start;
  cursor: pointer;
  padding: 0 4px;

  @include media(md) {
    padding: 0 8px;
  }

  .img {
    @include ratio(66px, 66px);
    border-radius: 8px;
    background-repeat: var(--bg-repeat, no-repeat);
    background-size: var(--bg-size, cover);
    background-position: var(--bg-position, top center);
  }

  .title {
    @include font($heading-1);
    color: var(--white);
    margin-top: rem(8px);
  }

  @include media(xs) {
    max-width: rem(66px);
  }

  @include media(md) {
    max-width: rem(96px);

    .title {
      display: block;
      @include upd-font($body-1);
    }
  }
}
</style>
