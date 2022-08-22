<template>
  <NuxtLayout name="default">
    <div class="not-found">
      <img class="img" src="@/assets/img/404.png" />
      <div class="title">Something went wrong</div>
      <p class="text">The page you are trying to access does not exist or has been moved. Try going back to our homepage.</p>
      <button-base
        type="primary"
        size="md"
        @click="goHome"
      >
        Homepage
      </button-base>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  const props = defineProps({
    error: Object,
  });
  const goHome = () => clearError({ redirect: '/' });
  const { preloaderDone } = useProjectMethods();

  onMounted(() => {
    console.error(props.error);
    preloaderDone();
  });
</script>

<style lang="scss">
@import "@/scss/error.scss";
</style>
