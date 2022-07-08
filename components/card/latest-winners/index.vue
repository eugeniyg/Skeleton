<template>
  <nuxt-link class="card-latest-winners" :to="localizePath(`${props.href}${!isLoggedIn ? '?demo=true' : '' }`)">
    <div class="img" :style="backgroundImage"></div>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title">{{ props.subTitle }}</div>
    <div class="items">
      <span v-for="(item, itemIndex) in props.items" :key="itemIndex" class="item">{{ item }}</span>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    href: {
      type: String,
      default: '',
    },
  });

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss" src="./style.scss"/>
