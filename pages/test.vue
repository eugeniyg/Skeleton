<template>
  <div class="nav-cat-wrap" ref="catNavWrap">
    <div class="nav-cat" ref="catNav">
      <span
        v-for="({ id, identity, name }, index) in visibleCatItems"
        :key="id"
        class="item"
        :class="[{'is-active': $route.query.category === identity}, lastItemClass(index)]"
        @click="emit('clickCategory', identity)"
      >
        <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon"/>
        <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
      </span>

      <span
        class="cat-select"
        ref="catSelect"
        @click="toggle"
        :class="{'is-open': isOpen}"
      >
        <atomic-icon id="more-menu"/>
        <span>All categories</span>
        <atomic-icon id="arrow_expand-close"/>

        <div class="cat-select-items" v-if="subCatItems.length">
          <span
            v-for="{ id, identity, name } in subCatItems"
            :key="id"
            class="item"
            :class="{ 'is-active': $route.query.category === identity }"
            @click="emit('clickCategory', identity)"
          >
            <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon"/>
            <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
          </span>
        </div>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GameInterface } from '@platform/frontend-core/dist/module';

  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const { gameCategoriesObj } = useGlobalStore();
  const filteredCategories = gameCollections.filter((collection) => !collection.isHidden);

  const visibleCatItems = ref<GameInterface[]>(filteredCategories);
  const subCatItems = ref<GameInterface[]>([]);
  const catNavWrap = ref<HTMLElement>();
  const catNav = ref<HTMLElement>();
  const catSelect = ref<HTMLElement>();
  const visibleIndexes = ref<number[]>([0]);
  const isOpen = ref<boolean>(false);
  const timeoutId = ref<any>();
  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const clickOutside = (e: Event) => {
    if (!e.target?.closest('.cat-select')) {
      isOpen.value = false;
    }
  };

  const lastItemClass = (index: number) => ({ 'last-item': index === visibleCatItems.value.length - 1 });

  const tick = () => {
    console.log('update');
    const stopWidth = catSelect?.value.offsetWidth || 0;
    let lastIndex = 0;

    const items = Array.from(catNav.value?.querySelectorAll('.item'));

    items.reduce((acc, item, index) => {
      acc += item?.offsetWidth;
      if (acc <= catNavWrap.value?.offsetWidth) {
        lastIndex = index;
      }
      return acc;
    }, stopWidth);

    console.log(lastIndex)
  };

  const update = () => {
    clearTimeout(timeoutId.value);
    if (window.innerWidth >= 1280) {
      timeoutId.value = setTimeout(tick, 250);
    } else {
      visibleCatItems.value = [...filteredCategories];
    }
  };

  onMounted(() => {
    window.addEventListener('resize', update);
    document.addEventListener('click', clickOutside);
    update();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update);
    document.removeEventListener('click', clickOutside);
  });

</script>

<style lang="scss">
.nav-cat-wrap {
  overflow-x: auto;
  min-height: var(--height, #{rem(32px)});
  margin-top: var(--margin-top, #{rem(24px)});
  margin-right: var(--margin-left, #{rem(-16px)});
  margin-bottom: var(--margin-bottom, #{rem(24px)});
  margin-left: var(--margin-right, #{rem(-16px)});
  @extend %scrollbar-hide;

  @include media(sm) {
    --margin-left: #{rem(-32px)};
    --margin-right: #{rem(-32px)};
  }

  @include media(md) {
    --margin-bottom: #{rem(40px)};
  }

  @include media(l) {
    overflow-x: visible;
    --margin-left: 0;
    --margin-right: 0;
  }
}

.nav-cat {
  @extend %flex-items-center;
  padding: rem(4px) rem(16px);
  display: inline-flex;
  border-radius: 8px;
  user-select: none;

  @include media(l) {
    padding: rem(4px);
    margin-left: rem(-4px);
    margin-right: rem(-4px);
    overflow-x: visible;
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
    padding: #{rem(8px)} #{rem(12px)} #{rem(8px)} #{rem(8px)};
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

    &.last-item {
      border-top-right-radius: (8px);
      border-bottom-right-radius: (8px);

      @include media(l) {
        border-radius: 0;
      }
    }
  }
}

.cat-select {
  position: relative;
  display: none;
  @include font($heading-1);
  @extend %flex-items-center;
  padding: #{rem(8px)} #{rem(14px)};
  height: var(--height, #{rem(32px)});
  cursor: pointer;
  background-color: var(--gray-800);
  color: var(--color, var(--gray-300));
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease-in-out;
  align-items: center;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  grid-column-gap: rem(8px);
  border-radius: 8px;

  .icon {
    position: relative;
    transition: transform .2s ease-in-out;
    --color: var(--white);
  }

  @include media(l) {
    display: flex;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &.is-open {
    --items-visibility: visible
  }

}

.cat-select-items {
  display: none;
  position: absolute;
  left: 0;
  max-width: 100%;
  width: 100%;
  padding: rem(8px);
  visibility: var(--items-visibility, hidden);
  max-height: calc((#{rem(38px)} * 4) + #{16px});
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--gray-800);
  transform: translateY(#{rem(8px)});
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  top: rem(30px);

  @extend %scrollbar;

  @include media(l) {
    display: grid;
  }

  .item {
    @include font($body-1);
    color: var(--color, var(--white));
    padding: rem(8px);
    cursor: pointer;
    user-select: none;
    background-color: var(--bg, transparent);
    transition: background-color .2s ease-in-out;
    position: relative;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-height: rem(38px);

    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr;
    grid-column-gap: rem(8px);

    span {
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon {
      //margin-left: auto;
      position: relative;
      //transform: var(--icon-transform, (rotate(0) translateX(#{rem(8px)})));
      transition: transform .2s ease-in-out;
      --color: var(--white);
    }

    &:hover {
      border-radius: 4px;
      --bg: var(--gray-700);
    }
  }

}
</style>
