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

<style lang="scss">
.text-wrap {
  color: var(--gray-500);
  margin-bottom: -24px;

  h1, h2 {
    @include font($heading-4);
  }

  h3, h4, h5, h6 {
    @include font($heading-2);
  }

  p {
    @include font($body-1-paragraph);
    margin: 0;
  }

  a {
    color: var(--gray-500);
    text-decoration: underline;
  }
}
</style>
