<template>
  <div class="card" @click="openGame">
    <div class="img" :style="backgroundImage"/>
    <div class="title">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IGameImages } from '@skeleton/core/types';

  const props = defineProps<{
    images?: IGameImages;
    name?: string;
    id: string;
    identity: string;
  }>();

  const { getImageUrl, localizePath } = useProjectMethods();
  const backgroundImage = computed(() => {
    if (props.images?.hasOwnProperty('200x200')) {
      return `background-image: url(${getImageUrl(props.images, 'square')})`;
    } return 'background-image: url(/img/default-game-tumb.png)';
  });

  const router = useRouter();
  const openGame = ():void => {
    router.push(localizePath(`/games/${props.identity}?real=true`));
  };
</script>

<style src="~/assets/styles/components/card/simple.scss" lang="scss" />

