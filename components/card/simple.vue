<template>
  <div class="card" @click="openGame">
    <div class="img" :style="backgroundImage" />
    <div class="title">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IGameImages } from '@skeleton/api/types';
  import { getGameImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    images?: IGameImages;
    customImages?: IGameImages;
    name?: string;
    id: string;
    identity: string;
  }>();

  const backgroundImage = computed(() => {
    return `background-image: url(${getGameImageUrl(props.customImages, props.images, 'square')})`;
  });

  const router = useRouter();
  const openGame = (): void => {
    router.push(localizePath(`/games/${props.identity}?real=true`));
  };
</script>

<style src="~/assets/styles/components/card/simple.scss" lang="scss" />
