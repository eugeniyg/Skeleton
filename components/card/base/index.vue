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

  const props = defineProps({
    src: {
      type: String,
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

  const getRandomInt = (min:number, max:number):number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const openGame = (isReal: boolean):void => {
    if (!isReal) {
      router.push(`/games/${props.id}?demo=true`);
    } else if (!isLoggedIn.value) {
      showModal('register');
    } else {
      router.push(`/games/${props.id}`);
    }
  };

  const backgroundImage = computed(() => `background-image:url(/img/cards/card-${getRandomInt(1, 12)}.png)`);
</script>

<style lang="scss" src="./style.scss"/>
