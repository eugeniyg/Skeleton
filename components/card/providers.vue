<template>
  <div class="card-providers" @click="routeToGames">
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

<style lang="scss">
.cards-providers {
  border-radius: 16px;
  background-color: var(--gray-900);
  padding: var(--card-padding, 16px);
  position: relative;

  @include media(sm) {
    --card-padding: 16px 24px;

    @include scroll-overlay;
  }
}

.card-providers {
  --col-count: 2.5;
  --col-gap: 8px;

  background-color: var(--gray-800);
  position: relative;
  padding: rem(16px);
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  width: calc(calc(100% / var(--col-count)) - calc(var(--col-gap) - calc(var(--col-gap) / var(--col-count))));

  @include media(xs) {
    --col-count: 3.5;
  }

  @include media(sm) {
    --col-gap: 16px;
    --col-count: 5;
  }

  @include media(xl) {
    --col-count: 9;
  }

  .img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
}
</style>
