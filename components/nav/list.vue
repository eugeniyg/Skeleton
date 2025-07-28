<template>
  <div class="nav-list">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <atomic-menu-category v-if="listItem?.items?.length" v-bind="listItem" />

      <atomic-link
        v-else
        class="link"
        :href="listItem.url"
        :target-blank="listItem?.targetBlank"
        :class="{ 'is-active': route.fullPath === localizePath(listItem.url) }"
      >
        <atomic-svg v-if="listItem?.displayCustomIcon && listItem?.customIcon" :src="listItem?.customIcon" />
        <atomic-icon v-else :id="listItem?.icon ? listItem?.icon : 'dot-md'" />

        <div class="text">{{ listItem.label }}</div>

        <client-only>
          <div v-if="listItem.counter" class="counter">{{ listItem.counter }}</div>
        </client-only>
      </atomic-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: any;
  }>();

  const route = useRoute();
</script>

<style src="~/assets/styles/components/nav/list.scss" lang="scss" />
