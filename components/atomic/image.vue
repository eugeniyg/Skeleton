<template>
  <img
    v-if="props.notLazy"
    ref="targetImage"
    :key="imageSrc"
    :src="imageSrc"
    alt=""
    data-not-lazy
  />

  <img
    v-else
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
    notLazy?: boolean;
    defaultImage?: string;
  }>();

  const useDefaultImg = ref<boolean>(false);
  const imageSrc = computed(() => {
    return useDefaultImg.value ? props.defaultImage : props.src;
  })

  const checkDefaultImage = (): void => {
    console.log('error event');
    if (props.defaultImage) useDefaultImg.value = true;
  }

  const targetImage = ref();
  onMounted(() => {
    console.dir(targetImage.value)
  })
</script>
