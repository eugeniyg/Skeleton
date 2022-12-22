<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span
        v-for="{ id, identity, name } in filteredCategories"
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
  const { gameCategoriesObj } = useGlobalStore();
  const filteredCategories = gameCollections.filter((collection) => !collection.isHidden);
</script>

<style lang="scss">
.nav-cat-wrap {
  overflow: hidden;
  height: var(--height, #{rem(32px)});
  margin-top: var(--margin-top, #{rem(24px)});
  margin-bottom: var(--margin-bottom, #{rem(24px)});
  margin-right: var(--margin-right, #{rem(-16px)});

  @include media(md) {
    --margin-right: 0;
    --margin-bottom: #{rem(40px)};
  }
}

.nav-cat {
  @extend %flex-items-center;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: block;
    width: 0;
  }

  &:after {
    content: '';
    min-width: 16px;
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
