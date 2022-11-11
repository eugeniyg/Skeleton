<template>
  <nav class="nav-faq" :class="{'is-open': isOpen}">
    <button class="selected" @click="toggle">
      {{ selected?.title }}
      <atomic-icon id="arrow_expand-close"/>
    </button>

    <div class="items" @mouseleave="close">
      <div
        v-for="(item, itemIndex) in props.items"
        :key="itemIndex"
        class="item"
        :class="{'is-active': $route.path === localizePath(`/questions/${item.pageUrl}`) }"
        @click.prevent="select(`/questions/${item.pageUrl}`)"
      >
        <atomic-icon :id="item.icon" />{{ item.title }}
        <atomic-icon v-show="$route.path === localizePath(`/questions/${item.pageUrl}`)" id="check"/>
      </div>
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
  const isOpen = ref<boolean>(false);
  const route = useRoute();
  const selected = computed(() => props.items.find((item:any) => localizePath(`/questions/${item.pageUrl}`) === route.path));

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    isOpen.value = false;
  };

  const router = useRouter();
  const select = (val:string) => {
    router.push(localizePath(val));
    close();
  };
</script>

<style lang="scss">
.nav-faq {
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
      display: grid;
      grid-gap: rem(4px);
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
    border-radius: 8px;

    .icon {
      margin-left: auto;
      right: rem(8px);
      transform: var(--icon-transform, rotate(0));
      transition: transform .2s ease-in-out;

      &:first-of-type {
        display: none;
      }

      --icon-color: var(--white);
    }

    @include media(l) {
      --item-padding: #{7px} #{16px};
      --color: var(--gray-300);

      &.is-active {
        --bg: var(--gray-800);
        --color: var(--yellow-500);

        .icon {
          --color: var(--yellow-500);
        }
      }

      .icon {
        &:first-of-type {
          position: relative;
          margin-left: 0;
          margin-right: 0;
          right: auto;
          display: block;
        }

        &:last-of-type {
          display: none;
        }
      }
    }

    &:hover {
      --bg: var(--gray-700);

      @include media(l) {
        --bg: var(--gray-800);
      }
    }

    &:hover {
      cursor: pointer;
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
}
</style>
