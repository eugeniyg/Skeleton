<template>
  <div class="promo-card">
    <picture>
      <source
        v-for="({media, src}, index) in props.image.source"
        :key="index"
        :media="media"
        :srcset="`/img${src[1]}`"
      />
      <img class="back" :src="`/img${props.image.src[1]}`" alt=""/>
    </picture>

    <picture>
      <source
        v-for="({media, src}, index) in props.image.source"
        :key="index"
        :media="media"
        :srcset="`/img${src[0]}`"
      />
      <img class="front" :src="`/img${props.image.src[0]}`" alt=""/>
    </picture>

    <div class="info">
      <div class="title" v-if="props.title" v-html="props.title"/>

      <ul class="list" v-if="props.list.length">
        <li class="item" v-for="(item, itemIndex) in props.list" :key="itemIndex">{{ item }}</li>
      </ul>

      <div class="actions" v-if="props.actions">
        <button-base
          v-if="props.actions.primary"
          type="primary"
          size="md"
          @click="showModal(isLoggedIn ? 'deposit': 'register')"
        >{{ props.actions.primary.title }}</button-base>
        <button-base
          v-if="props.actions.secondary"
          type="secondary"
          size="md"
          @click="showModal(isLoggedIn ? 'deposit': 'register')"
        >{{ props.actions.secondary.title }}</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    image: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: 'Play over 3000 provably fair games',
    },
    subTitle: {
      type: String,
      default: 'Win big by choosing the correct side. Pick a side and let luck decide!',
    },
    list: {
      type: Array,
      default: () => [],
    },
    actions: {
      type: Object,
      required: false,
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss"/>
