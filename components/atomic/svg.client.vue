<template>
  <inline-svg v-if="!isShowPlaceHolder" class="inline-svg" :src="props.src" @error="svgLoadError"/>
  <atomic-icon v-else :id="props.defaultIcon || 'dot-md'"/>
</template>

<script setup lang="ts">
  import inlineSvg from 'vue-inline-svg';
  
  const props = defineProps<{
    src: string,
    defaultIcon?: string,
  }>();
  
  const isShowPlaceHolder = ref<boolean>(false);
  
  const svgLoadError = () => {
    isShowPlaceHolder.value = true
  }
</script>

<style src="~/assets/styles/components/atomic/svg.scss" lang="scss"/>
