<template>
  <div class="card-providers" @click="routeToGames">
    <img class="img" :src="`/img${props.src}`" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  });

  const router = useRouter();

  const routeToGames = (): void => {
    router.push({
      path: 'games',
      query: { category: 'all', provider: props.providerId },
    });
  };
</script>

<style lang="scss" src="./style.scss" />
