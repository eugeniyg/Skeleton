<template>
  <div class="box-game" :class="boxGameClassModifiers">
    <div class="container">
      <iframe
        v-if="props.frameLink"
        :key="props.frameLink"
        :src="props.frameLink"
        height="100%"
        width="100%"
      />

      <not-auth-game
        v-else-if="showPlug && gameContent?.plug"
        v-bind="gameContent.plug"
      />
    </div>

    <nav-game :showPlug="showPlug" :gameInfo="gameInfo"/>

    <panel-mode v-if="!showPlug" :gameContent="gameContent" @changeMode="emit('changeMode')"/>

    <group-games
      v-if="recommendedCategory"
      :category="recommendedCategory"
      showArrows
      subTitle
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    frameLink: {
      type: String,
      required: false,
    },
    showPlug: {
      type: Boolean,
      default: true,
    },
    gameInfo: {
      type: Object,
      required: false,
    },
    gameContent: {
      type: Object,
      required: false,
    },
  });

  const emit = defineEmits(['changeMode']);

  const { currentLocationCollections } = useGamesStore();
  const recommendedCategory = currentLocationCollections.find((collection) => collection.identity === 'recommended');
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const boxGameClassModifiers = computed(() => {
    return isLoggedIn.value ? 'box-game--login' : 'box-game--logout'
  });
</script>

<style src="~/assets/styles/components/box-game.scss" lang="scss" />

