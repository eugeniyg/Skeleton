<template>
  <img
    v-if="props.notLazy"
    ref="targetImage"
    :key="imageSrc"
    :src="imageSrc"
    alt=""
    data-not-lazy
    @error="checkDefaultImage"
  />

  <img
    v-else
    :key="imageSrc"
    :src="imageSrc"
    alt=""
    @error="checkDefaultImage"
  />
</template>

<script setup lang="ts">
  const props = defineProps<{
    src?: string;
    notLazy?: boolean;
    defaultImage?: string;
  }>();

  const useDefaultImg = ref<boolean>(false);
  const imageSrc = computed(() => {
    return useDefaultImg.value ? props.defaultImage : props.src;
  })

  const checkDefaultImage = (): void => {
    if (props.defaultImage) useDefaultImg.value = true;
  }

  const targetImage = ref<HTMLImageElement>();
  onMounted(() => {
    if (props.notLazy
      && props.defaultImage
      && targetImage.value?.complete
      && !targetImage.value?.naturalWidth
    ) useDefaultImg.value = true;
  })
</script>
