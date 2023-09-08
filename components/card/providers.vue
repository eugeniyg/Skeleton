<template>
  <div class="card-providers" @click="routeToGames">\
    <nuxt-img class="img" :src="`/img${props.src}`"/>
    <img class="img" :src="`/img${props.src}`"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    src: string,
    providerId: string
  }>();

  const router = useRouter();

  const { localizePath } = useProjectMethods();
  const routeToGames = (): void => {
    router.push({
      path: localizePath('/games'),
      query: { category: 'all', provider: props.providerId },
    });
  };
</script>

<style src="~/assets/styles/components/card/providers.scss" lang="scss" />

