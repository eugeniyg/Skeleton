<template>
  <div class="card-turbo">
    <nuxt-link class="thumb" :to="localizePath(props.url)" :style="backgroundImage" />

    <div class="content">
      <div class="title">{{ props.title }}</div>

      <button-base
        type="secondary"
        size="xs"
        :url="props.url"
      >
        {{ props.buttonLabel }}
      </button-base>

      <dl class="dl">
        <dt class="dl__title">{{ props.infoLabel }}</dt>
        <dd class="dl__value">{{ props.categoryLabel }}</dd>
        <dt class="dl__sub-title">{{ props.infoValue }}</dt>
        <dd class="dl__sub-value">{{ props.categoryValue }}</dd>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    buttonLabel: string,
    infoLabel: string,
    categoryLabel: string,
    url: string,
    image: string,
    title: string,
    infoValue: string,
    categoryValue: string
  }>();

  const backgroundImage = computed(() => `background-image:url(${props.image})`);
  const { localizePath } = useProjectMethods();
</script>

<style lang="scss" src="./style.scss"></style>
