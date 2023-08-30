<template>
  <div class="card-turbo">
    <div class="content">
      <nuxt-link class="thumb" :to="localizePath(props.url)" :style="backgroundImage"/>
      <div class="title">{{ props.title }}</div>

      <div class="sub-title">{{ props?.categoryValue }}</div>

      <button-base
        type="primary"
        size="xs"
        :url="props.url"
      >
        {{ props.buttonLabel }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    buttonLabel: string,
    url: string,
    image: string,
    title: string,
    categoryValue: string
  }>();

  const backgroundImage = computed(() => `background-image:url(${props.image})`);
  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/card/turbo.scss" lang="scss" />

