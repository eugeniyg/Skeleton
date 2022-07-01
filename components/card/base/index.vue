<template>
  <div class="card-base" :style="backgroundImage">
    <div v-if="props.bages && props.bages.length" class="bages">
      <atomic-bage
        v-for="(bage, bageIndex) in props.bages"
        :key="bageIndex"
        :variant="bage.variant"
      >
        {{ bage.title }}
      </atomic-bage>
    </div>

    <div class="info">
      <div v-if="props.name" class="title">{{ props.name }}</div>

      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>

      <button-favorite v-if="props.showFavorite"/>

      <button-play @click="openGame(true)"/>

      <button-base
        v-if="props.isDemoMode"
        class="btn-try"
        tag-name="span"
        type="secondary"
        size="xs"
        @click="openGame(false)"
      >
        Try for fun
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { PropType } from '@vue/runtime-core';
  import { GameImagesInterface } from '~/types/gameTypes';

  const props = defineProps({
    src: {
      type: String,
      required: false,
    },
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
    bages: {
      type: Array || undefined,
      default: () => [],
    },
    showFavorite: {
      type: Boolean,
      default: false,
    },
  });

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const openGame = (isReal: boolean):void => {
    if (!isReal) {
      router.push(`/games/${props.identity}?demo=true`);
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else {
      router.push(`/games/${props.identity}`);
    }
  };

  const { baseApiUrl } = useGlobalStore();
  const { getImageUrl } = useProjectMethods();
  const backgroundImage = computed(() => {
    if (props.images.hasOwnProperty('200x300')) {
      return `background-image:url(${baseApiUrl}/img/gcdn${getImageUrl(props.images, 'vertical')})`;
    } return 'background-image: none';
  });
</script>

<style lang="scss" src="./style.scss"/>
