<template>
  <div class="cta-menu">
    <a
      v-for="item in props.items" :href="item.url"
      class="cta-menu__item"
      :class="{'is-active': $route.path === localizePath(item.url)}"
    >
      <span class="cta-menu__title">{{ item.title }}</span>
      <span class="cta-menu__sub-title">{{ item.subTitle }}</span>
      <img class="cta-menu__img" :src="item.image" alt="">
    </a>
  </div>
</template>

<script setup lang="ts">
  import { ISiteSidebar } from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['ctaMenu']['items']
  }>();

  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/cta-menu.scss" lang="scss"/>
