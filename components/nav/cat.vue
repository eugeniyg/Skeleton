<template>

  <div class="nav-cat-scroll">
    <div class="nav-cat-wrap" ref="viewport">
      <div class="nav-cat">
        <span
          v-for="({ id, identity, name }, index) in filteredCategories"
          class="nav-cat-item"
          :data-index="index"
          :class="{
            'is-active': $route.query.category === identity,
            'is-hidden': index >= visibleIndex.length,
            'is-no-icon': !gameCategoriesObj[identity]?.icon
          }"
          @click="emit('clickCategory', identity)"
          :key="id"
        >
          <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon"/>
          <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
        </span>

        <span
          class="nav-cat-select"
          v-click-outside="close"
          :class="{
            'is-hidden' : isSelectHidden,
            'is-open': isOpen,
          }"
          ref="select"
          @click="toggle"
        >
          <atomic-icon id="more-menu"/>
          <span>All categories</span>
          <atomic-icon class="icon-expand" id="arrow_expand-close"/>

          <span
            class="nav-cat-select-items"
          >
            <span
              v-for="({ id, identity, name }, index) in filteredCategories"
              :key="id"
              class="nav-cat-select-item"
              :class="{
                'is-active': $route.query.category === identity,
                'is-hidden':  index < visibleIndex.length,
              }"
              @click="emit('clickCategory', identity)"
            >
              <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon"/>
              <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
              <atomic-icon v-if="$route.query.category === identity" id="check"/>
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { currentLocaleCollections } = useGamesStore();
  const { gameCategoriesObj } = useGlobalStore();
  const filteredCategories = currentLocaleCollections.filter((collection) => !collection.isHidden);

  const viewport = ref<HTMLElement>();
  const select = ref<HTMLElement>();

  const isOpen = ref<boolean>(false);
  const isSelectHidden = ref<boolean>(false);
  const visibleIndex = ref<any[]>([]);
  const timeoutId = ref<any>();

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    if (isOpen.value) isOpen.value = false;
  };

  const getItemsData = () => {
    const offset = 4;
    return [...document.querySelectorAll('.nav-cat-item')]
      .map((item) => item.offsetWidth + offset)
      .reduce((acc, curr) => {
        acc.totalWidth += curr;
        acc.width.push(acc.totalWidth);
        return acc;
      }, {
        totalWidth: 0,
        width: [],
      });
  };

  const update = () => {
    const viewportWidth = viewport.value?.offsetWidth || 0;
    const toggleWidth = select.value?.offsetWidth || 0;
    const { width, totalWidth } = getItemsData();

    visibleIndex.value = width.filter((item: any) => item < viewportWidth - toggleWidth || viewportWidth > totalWidth);

    isSelectHidden.value = visibleIndex.value.length === width.length;
  };

  const onResize = () => {
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(update, 250);
  };

  onMounted(() => {
    setTimeout(update, 250);
    window.addEventListener('resize', onResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
  });

</script>

<style lang="scss">
.nav-cat-wrap {
  border-radius: 8px;
}

.nav-cat-scroll {
  @extend %scrollbar-hide;
  overflow: auto;
  margin-top: var(--margin-top, #{rem(24px)});
  margin-right: var(--margin-right, #{rem(-16px)});
  margin-bottom: var(--margin-bottom, #{rem(24px)});
  margin-left: var(--margin-left, #{rem(-16px)});
  position: relative;
  z-index: 1;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .category & {
    --margin-top: 0;
    --margin-bottom: 0;
  }

  @include media(sm) {
    --margin-left: #{rem(-32px)};
    --margin-right: #{rem(-32px)};
  }

  @include media(md) {
    --margin-bottom: #{rem(40px)};
  }

  @include media(l) {
    overflow: visible;
    max-width: 100%;
    min-width: 0;
    width: 100%;
    --margin-left: 0;
    --margin-right: 0;
  }
}

.nav-cat {
  @extend %flex-items-center;
  padding: rem(4px) rem(22px);
  display: inline-flex;
  border-radius: 8px;
  user-select: none;
  grid-column-gap: 4px;
  position: relative;

  @include media(sm) {
    padding: rem(4px) rem(36px);
  }

  @include media(l) {
    padding: rem(4px);
    overflow-x: visible;
  }

  &:before {
    background: var(--gray-800);
    position: absolute;
    content: '';
    top: 0;
    right: var(--right, 16px);
    bottom: 0;
    left: var(--left, 16px);
    border-radius: 8px;

    @include media(sm) {
      --left: 32px;
      --right: 32px;
    }

    @include media(l) {
      --left: 0;
      --right: 0;
    }
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
  position: relative;
  grid-column-gap: rem(4px);
  padding: var(--item-padding, 0 #{rem(12px)} 0 #{rem(8px)});
  height: var(--item-height, #{rem(24px)});
  cursor: pointer;
  background-color: var(--bg, var(--gray-800));
  color: var(--color, var(--gray-300));
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease-in-out;
  border-radius: 8px;
  @include font($heading-1);
  @extend %flex-items-center;

  @include use-hover {
    &:hover {
      --color: var(--white);

      .icon {
        --color: var(--white);
      }
    }
  }

  @include media(l) {
    --item-height: #{rem(32px)};
    --item-padding: 0 #{rem(16px)};
    @include upd-font($heading-2);
  }

  &.is-no-icon {
    --item-padding: 0 #{rem(8px)};

    @include media(sm) {
      --item-padding: 0 #{rem(16px)};
    }
  }

  &.is-hidden {
    @include media(l) {
      position: absolute;
      visibility: hidden;
    }
  }

  .icon {
    --color: var(--gray-400);
    --icon-size: 20px;
  }

  &.is-active {
    --bg: var(--gray-700);
    --border-color: var(--gray-700);
    --color: var(--white);

    .icon {
      --color: var(--white);
    }
  }
}

.nav-cat-select {
  @include font($heading-1);
  display: flex;
  @extend %flex-items-center;
  padding: #{rem(8px)} #{rem(14px)} #{rem(8px)} #{rem(18px)};
  height: var(--height, #{rem(24px)});
  background-color: var(--gray-800);
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease-in-out;
  align-items: center;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  grid-column-gap: rem(8px);
  border-radius: 8px;
  cursor: pointer;
  margin-left: rem(-4px);
  color: var(--color, var(--gray-300));
  position: var(--position, absolute);
  visibility: var(--visibility, hidden);

  .icon {
    position: relative;
    transition: transform .2s ease-in-out;
    transform: var(--icon-transform, rotate(0));
    --color: var(--gray-400);
    --icon-size: 20px;
  }

  @include media(l) {
    @include upd-font($heading-2);
    --height: #{rem(32px)};
    --position: relative;
    --visibility: visible;
  }

  &.is-hidden {
    --position: absolute;
    --visibility: hidden;
  }

  &.is-open {
    .icon-expand {
      --icon-transform: rotate(-180deg);
    }

    .nav-cat-select-items {
      display: grid;
    }

    > .icon {
      --color: var(--white);
    }

    --color: var(--white);
  }

  @include use-hover {
    &:hover {
      --color: var(--white);

      > .icon {
        --color: var(--white);
      }
    }
  }
}

.nav-cat-select-items {
  color: var(--gray-300);
  display: none;
  position: absolute;
  right: rem(-4px);
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
}

.nav-cat-select-item {
  @include font($body-1);
  color: var(--gray-300);
  padding: rem(8px) rem(6px);
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
  border-radius: 8px;

  @include use-hover {
    &:hover {
      --bg: var(--gray-700);
      color: var(--white);
    }
  }

  span {
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    position: relative;
    transition: transform .2s ease-in-out;
    --icon-size: 20px;
    --color: var(--gray-400);
    justify-self: flex-end;
  }

  &.is-active {
    --border-color: var(--gray-700);
    color: var(--white);

    .icon {
      --color: var(--white);
    }
  }

  &.is-hidden {
    display: none;
  }
}
</style>
