<template>
  <div
    class="card-base"
    :style="backgroundImage"
    :class="[{ 'hovered': gameHovered }, `card-${props.id}`]"
    @click="clickGame"
  >
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
    bages: {
      type: Array || undefined,
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

<style lang="scss" src="./style.scss"/>
