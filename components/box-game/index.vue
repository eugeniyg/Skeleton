<template>
  <div class="box-game">
    <div class="container">
      <iframe
        v-if="props.frameLink"
        :key="props.frameLink"
        :src="props.frameLink"
        height="100%"
        width="100%"
      />
    </div>
    <nav-game/>
    <panel-mode @changeMode="emit('changeMode')"/>

    <cards-group v-bind="gameCollections[7]" showArrows subTitle="The best games for you">
      <template v-slot:card="item">
        <card-base v-bind="item"/>
      </template>
    </cards-group>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    frameLink: {
      type: String,
      required: false,
    },
    gameInfo: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['changeMode']);

  const { gameCollections } = useGamesStore();
</script>

<style lang="scss" src="./style.scss"/>
