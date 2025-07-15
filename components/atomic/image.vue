<template>
  <img
    v-if="props.notLazy"
    ref="targetImage"
    :key="imageSrc"
    :src="imageSrc"
    :fetchpriority="props.fetchpriority"
    :preload="!!props.fetchpriority"
    alt=""
    data-not-lazy
    @error="checkDefaultImage"
  />

  <img
    v-else
    :key="`lazy-${imageSrc}`"
    :src="imageSrc"
    :fetchpriority="props.fetchpriority"
    alt=""
    @error="checkDefaultImage"
  />
</template>

<script setup lang="ts">
  const props = defineProps<{
    src?: string;
    notLazy?: boolean;
    defaultImage?: string;
    fetchpriority?: string;
  }>();

  const useDefaultImg = ref<boolean>(false);
  const imageSrc = computed(() => {
    return useDefaultImg.value ? props.defaultImage : props.src;
  });

  const checkDefaultImage = (): void => {
    if (props.defaultImage) useDefaultImg.value = true;
  };

  const targetImage = ref<HTMLImageElement>();
  onMounted(() => {
    if (props.notLazy && props.defaultImage && targetImage.value?.complete && !targetImage.value?.naturalWidth)
      useDefaultImg.value = true;
  });
</script>
