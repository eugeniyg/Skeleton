<template>
  <img
    ref="targetImage"
    :key="imageSrc"
    :src="imageSrc"
    alt=""
    @error="checkDefaultImage"
  />
</template>

<script setup lang="ts">
  const props = defineProps<{
    src?: string;
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
    if (props.defaultImage
      && targetImage.value?.complete
      && !targetImage.value?.naturalWidth
    ) useDefaultImg.value = true;
  })
</script>
