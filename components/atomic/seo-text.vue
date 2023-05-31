<template>
  <div class="text-wrap">
    <div
      v-if="props.visible"
      class="text-wrap__visible"
      v-html="marked.parse(props.visible)"
    />

    <div
      v-if="props.hidden"
      v-show="showHidden"
      class="text-wrap__hidden"
      v-html="marked.parse(props.hidden)"
    />

    <button-show-more v-if="showButton" @click="showHidden = true">
      {{ props.button }}
    </button-show-more>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const props = defineProps<{
    visible?: string,
    hidden?: string,
    button?: string
  }>();

  const showHidden = ref<boolean>(false);
  const showButton = computed(() => props.button && props.hidden && !showHidden.value);
</script>

<style src="~/assets/styles/components/atomic/seo-text.scss" lang="scss" />
