<template>
  <div class="card-providers" @click="routeToGames">
    <img class="img" :src="`/img${props.src}`" />
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
  padding: rem(16px);
  margin-top: rem(40px);

  @include media(md) {
    padding: rem(24px);
  }
}

.card-providers {
  background-color: var(--gray-800);
  position: relative;
  padding: rem(16px);
  flex-shrink: 0;
  width: var(--width, #{column(3)});
  cursor: pointer;
  border: 4px solid var(--gray-900);
  border-radius: 8px;

  .img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  @include media(xs) {
    --width: #{column(4)};
  }

  @include media(sm) {
    --width: #{column(6)};
  }

  @include media(xl) {
    --width: #{column(9)};
  }
}
</style>
