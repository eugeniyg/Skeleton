<template>
  <div class="nav-cat-wrap" ref="viewport">
    <div class="nav-cat" ref="navCat">
      <span
        v-for="({ id, identity, name }, index) in testItems"
        class="nav-cat-item"
        :data-index="index"
        :data-debug="visibleIndexes.length"
        :class="{
          'is-active': $route.query.category === identity,
          'is-hidden': isLoaded && !visibleIndexes.includes(index)
        }"
        @click="emit('clickCategory', identity)"
        :key="id"
      >
        <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon"/>
        <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
      </span>

      <span
        class="nav-cat-select"
        :class="{
          //'is-hidden' : visibleIndexes.length === testItems.length
        }"
        ref="toggleSelect"
        @click="toggle"
      >
        <atomic-icon id="more-menu"/>
        <span>All categories</span>
        <atomic-icon id="arrow_expand-close"/>

        <div
          class="nav-cat-select-items"
          :class="{
            'is-open': isOpen,
          }"
        >
          <span
            v-for="({ id, identity, name }, index) in testItems"
            :key="id"
            class="nav-cat-select-item"
            :class="{
              'is-active': $route.query.category === identity,
            }"
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
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const { gameCategoriesObj } = useGlobalStore();
  const filteredCategories = gameCollections.filter((collection) => !collection.isHidden);

  const testItems = ref([
    ...filteredCategories,
    ...filteredCategories.slice(0, 3),
  ]);

  const viewport = ref<HTMLElement | undefined>();
  const navCat = ref<HTMLElement | undefined>();
  const items = ref<NodeListOf<HTMLElement>>();
  const subItems = ref<NodeListOf<HTMLElement>>();
  const toggleSelect = ref<HTMLElement | undefined>();
  const width = ref<string[]>([]);
  const visibleIndexes = ref<number[]>([]);
  const timeoutId = ref<any>();

  const isLoaded = ref<boolean>(false);
  const isOpen = ref<boolean>(false);
  const toggleWidth = ref<number | undefined>(0);
  const isToggleHidden = ref<boolean>(false);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  const update = () => {
    console.clear();
    const indexes: number[] = [];

    width.value.reduce((acc, curr, index) => {
      acc += curr;

      if (acc < viewport.value.offsetWidth) {
        indexes.push(index);
        console.log(index)
      }

      // if (!indexes) isToggleHidden.value = false;

      return acc;
    }, 0);

    visibleIndexes.value = [...indexes];

    indexes.length = 0;

    console.log(visibleIndexes.value.length  items.value.length)

    // items.value?.forEach((item, index) => {
    //   item.style.display = visibleIndexes.value.includes(index) ? 'flex' : 'none';
    // });

    subItems.value?.forEach((item, index) => {
      item.style.display = !visibleIndexes.value.includes(index) ? 'flex' : 'none';
    });

    toggleSelect.value.style.display = isToggleHidden.value ? 'none' : 'flex';
  };

  const onResize = () => {
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(update, 250);
  };

  const clickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.nav-cat-select')) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    setTimeout(() => {
      items.value = document.querySelectorAll('.nav-cat-item');
      subItems.value = document.querySelectorAll('.nav-cat-select-item');
      width.value = [...items.value].map((item) => (item ? item.offsetWidth : 0));
      toggleWidth.value = toggleSelect.value?.offsetWidth;
      isLoaded.value = true;
      update();
    }, 200);

    window.addEventListener('resize', onResize);
    document.addEventListener('click', clickOutside);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('click', clickOutside);
  });

</script>

<style lang="scss">
.nav-cat-wrap {
  overflow: auto;
  min-height: var(--height, #{rem(32px)});
  margin-top: var(--margin-top, #{rem(24px)});
  margin-right: var(--margin-right, #{rem(-16px)});
  margin-bottom: var(--margin-bottom, #{rem(24px)});
  margin-left: var(--margin-left, #{rem(-16px)});
  @extend %scrollbar-hide;
  position: relative;
  z-index: 1;
  background: antiquewhite;

  @include media(sm) {
    --margin-left: #{rem(-32px)};
    --margin-right: #{rem(-32px)};
  }

  @include media(md) {
    --margin-bottom: #{rem(40px)};
  }

  @include media(l) {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    overflow: visible;
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

  @include media(sm) {
    padding: rem(4px) rem(32px);
  }

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
}

.nav-cat-item {
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

  &:first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &.is-last-mob {
    border-top-right-radius: (8px);
    border-bottom-right-radius: (8px);

    @include media(l) {
      border-radius: 0;
    }
  }

  &.is-last-desk {
    border-top-right-radius: (8px);
    border-bottom-right-radius: (8px);
  }

  &.is-hidden {
    @include media(l) {
      display: none;
    }
  }
}

.nav-cat-select {
  position: relative;
  display: var(--display, none);
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
    --display: flex;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &.is-hidden {
    --display: none;
  }

  &.is-open {
    .nav-cat-select-items {
      display: grid;
    }
  }
}

.nav-cat-select-items {
  display: none;
  position: absolute;
  left: 0;
  max-width: 100%;
  width: 100%;
  padding: rem(8px);
  max-height: calc((#{rem(38px)} * 4) + #{16px});
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--gray-800);
  transform: translateY(#{rem(8px)});
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  top: rem(30px);

  @extend %scrollbar;

  &.is-open {
    display: grid;
  }
}

.nav-cat-select-item {
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
    position: relative;
    transition: transform .2s ease-in-out;
    --color: var(--white);
  }

  &.is-hidden {
    display: none;
  }
}
</style>
