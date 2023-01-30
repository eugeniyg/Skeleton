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
    overflow: hidden;

    &:before, &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 24px;
      background-color: var(--layer-bg, var(--gray-900));
      z-index: 2;
    }

    &:before {
      left: 0;
    }

    &:after {
      right: 0;
    }
  }
}

.card-providers {
  background-color: var(--gray-800);
  position: relative;
  padding: rem(16px);
  flex-shrink: 0;
  width: var(--width, #{column(2.5)});
  cursor: pointer;
  border-radius: 16px;
  border: 4px solid var(--gray-900);

  @include media(sm) {
    border: 8px solid var(--gray-900);
  }

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
