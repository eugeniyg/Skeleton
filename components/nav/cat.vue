<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span
        v-for="{ id, identity, name } in sortedCategories"
        :key="id"
        class="item"
        :class="{ 'is-active': $route.query.category === identity }"
        @click="emit('clickCategory', identity)"
      >
        <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon" />
        <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const { gameCategoriesObj, globalComponentsContent } = useGlobalStore();
  const filteredCategories = gameCollections.filter((collection) => !collection.isHidden).map((category) => {
    const contentArrayIndex = globalComponentsContent?.categories?.findIndex((item) => item.identity === category.identity);
    return { ...category, sortIndex: contentArrayIndex && contentArrayIndex < 0 ? undefined : contentArrayIndex };
  });
  const sortedCategories = filteredCategories.sort((prevEl, nextEl) => {
    if (!prevEl.sortIndex || !nextEl.sortIndex) return 1;
    if (prevEl.sortIndex < nextEl.sortIndex) return -1;
    return 1;
  });
</script>

<style lang="scss">
.nav-cat-wrap {
  overflow: hidden;
  height: var(--height, #{rem(32px)});
  margin-top: var(--margin-top, #{rem(24px)});
  margin-right: var(--margin-right, #{rem(-16px)});
  margin-bottom: var(--margin-bottom, #{rem(24px)});
  margin-left: var(--margin-right, #{rem(-16px)});

  @include media(sm) {
    --margin-left: #{rem(-32px)};
    --margin-right: #{rem(-32px)};
  }

  @include media(md) {
    --margin-bottom: #{rem(40px)};
  }

  @include media(l) {
    --margin-left: 0;
    --margin-right: 0;
  }
}

.nav-cat {
  @extend %flex-items-center;
  overflow-x: auto;
  padding: var(--padding, 0 #{rem(16px)});

  @include media(sm) {
    --padding: 0 #{rem(32px)};
  }

  @include media(l) {
    --padding: 0;
  }

  &::-webkit-scrollbar {
    display: block;
    width: 0;
  }

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  .item {
    @include font($heading-1);
    @extend %flex-items-center;
    grid-column-gap: rem(4px);
    padding: #{rem(8px)} #{rem(14px)};
    height: var(--height, #{rem(32px)});
    cursor: pointer;
    background-color: var(--gray-800);
    color: var(--color, var(--gray-300));
    text-decoration: none;
    white-space: nowrap;
    transition: color .2s ease-in-out;

    .icon {
      --color: var(--gray-400);
    }

    &:hover {
      --color: var(--white);

      .icon {
        --color: var(--white);
      }
    }

    &:focus, &:active, &.is-active {
      --color: var(--yellow-500);

      .icon {
        --color: var(--yellow-500);
      }
    }

    &:first-of-type {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-of-type {
      border-top-right-radius: (8px);
      border-bottom-right-radius: (8px);
    }
  }
}
</style>
