<template>
  <div class="cta-menu">
    <a
      v-for="item in props.items" :href="item.url"
      class="cta-menu__item"
      :class="{'is-active': route.path === localizePath(item.url)}"
    >
      <span class="cta-menu__title">{{ item.title }}</span>
      <span class="cta-menu__sub-title">{{ item.subTitle }}</span>
      <atomic-image class="cta-menu__img" :src="item.image" />
    </a>
  </div>
</template>

<script setup lang="ts">
  import type { ISiteSidebar } from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['ctaMenu']['items']
  }>();

  const route = useRoute();

  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/cta-menu.scss" lang="scss"/>
