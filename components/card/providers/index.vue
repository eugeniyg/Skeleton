<template>
  <div class="card-providers" @click="routeToGames(props.providerId)">
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

  const routeToGames = (providerId: string):void => {
    router.push({ path: 'games', query: { category: 'all', provider: providerId } });
  };
</script>

<style lang="scss" src="./style.scss"/>
