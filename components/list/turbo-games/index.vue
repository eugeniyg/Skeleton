<template>
  <div class="turbo-games" :class="{'is-compact' : props.isCompact}">
    <nuxt-link
      v-for="(item, index) in props.items"
      :key="index"
      class="item"
      :to="localizePath(`${item.href}${!isLoggedIn ? '?demo=true' : '' }`)"
    >
      <img class="img" :src="`/img/${item.src}`" alt="" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
  });

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"/>
