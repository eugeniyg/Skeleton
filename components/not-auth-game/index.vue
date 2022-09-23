<template>
  <div class="not-auth-game" :class="modeClassName">
    <div class="title" v-if="props.title">{{ props.title }}</div>
    <img
      class="img"
      :src="`/assets${src}`"
      width="104"
      height="104"
      alt=""
    />
    <p class="text" v-html="props.text"></p>
    <div class="actions">
      <button-base type="primary" :size="modeBtnSize">Registration</button-base>
      <button-base type="secondary" :size="modeBtnSize">Login</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
    },
    isSingleMode: {
      type: Boolean | true,
    },
    src: {
      type: String,
    }
  }>();

  const modeClassName = computed(() => ({ 'is-single-mode': props.isSingleMode }));
  const modeBtnSize = computed(() => (props.isSingleMode ? 'md' : 'lg'));
</script>

<style lang="scss" src="./style.scss"></style>
