<template>
  <nav class="nav-profile" :class="{'is-open': isOpen}">
    <button class="selected" @click="toggle">
      {{ selected?.title }}<atomic-icon id="arrow_expand-close"/>
    </button>

    <div class="items" @mouseleave="close">
      <router-link
        v-for="(item, index) in props.items"
        @click="toggle"
        :key="index"
        class="item"
        :class="{'is-active': $route.path === localizePath(item.url)}"
        :to="localizePath(item.url)"
      >
        {{ item.title }}<span v-if="item.count" class="count">{{ item.count }}</span>

        <template v-if="$route.path === localizePath(item.url)">
          <atomic-icon id="check"/>
        </template>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const { localizePath } = useProjectMethods();
  const route = useRoute();
  const isOpen = ref<boolean>(false);
  const selected = computed(() => props.items.find((item:any) => localizePath(item.url) === route.path));

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    isOpen.value = false;
  };
</script>

<style lang="scss">
.nav-profile {
  .selected {
    border-radius: 8px;
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    cursor: pointer;
    user-select: none;
    padding: rem(19px) rem(44px) rem(19px) rem(16px);
    display: flex;
    align-items: center;
    background-color: var(--bg, var(--gray-800));
    position: relative;
    transition: border-color .2s ease-in-out;
    min-height: rem(42px);
    grid-column-gap: rem(8px);
    grid-row-gap: rem(24px);
    @include font($body-2);
    width: 100%;

    @include media(l) {
      display: none;
    }
  }

  .icon {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 16px;
    margin-top: auto;
    margin-bottom: auto;
    transform: var(--icon-transform, rotate(0));
    transition: transform .2s ease-in-out;

    --color: var(--gray-400);
  }

  .items {
    position: var(--items-position, absolute);
    visibility: var(--items-visibility, hidden);
    left: 0;
    right: 0;
    padding: var(--items-padding, #{rem(8px)});
    background-color: var(--bg, var(--gray-800));
    transform: translateY(#{rem(8px)});
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;

    @include media(l) {
      transform: unset;
      width: rem(200px);
      grid-gap: rem(4px);
      display: grid;
      --items-visibility: visible;
      --items-position: relative;
      --bg: transparent;
      --items-padding: 0;
    }
  }

  .count {
    @include font($heading-1);
    color: var(--yellow-500)
  }

  .item {
    @include font($body-2);
    color: var(--color, var(--white));
    padding: var(--item-padding, #{rem(8px)});
    cursor: pointer;
    user-select: none;
    background-color: var(--bg, transparent);
    transition: background-color .2s ease-in-out;
    position: relative;
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);

    @include media(l) {
      --item-padding: #{7px} #{16px};
      --color: var(--gray-300);
      justify-content: space-between;
      border-radius: 8px;

      &.is-active {
        --bg: var(--gray-800);
        --color: var(--yellow-500);
      }

      .icon {
        display: none;
      }

    }

    .icon {
      margin-left: auto;
      right: rem(8px);
      transform: var(--icon-transform, rotate(0));
      transition: transform .2s ease-in-out;

      --icon-color: var(--white);
    }

    &:hover {
      cursor: pointer;
      border-radius: 8px;
      --bg: var(--gray-700);

      @include media(l) {
        --bg: var(--gray-800);
      }
    }
  }

  &.is-open {
    z-index: 2;

    .selected {
      --border-color: var(--gray-300);
      --color: var(--white);
      --bg: var(--gray-700);
      --icon-transform: rotate(180deg);

      .icon {
        --color: var(--white);
      }
    }

    --items-visibility: visible;
  }

  a {
    text-decoration: none;
  }
}
</style>
