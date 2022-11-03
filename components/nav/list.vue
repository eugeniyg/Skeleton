<template>
  <div class="nav-list">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <template v-if="listItem?.items?.length">
        <div
          class="link"
          @click.prevent="toggleOpen"
          :class="{'is-open': open}"
        >
          <atomic-icon :id="listItem.icon"/>
          <div class="text">{{ listItem.label }}</div>
          <button-toggle/>
        </div>

        <div class="items">
          <nuxt-link
            v-for="(link, itemIndex) in listItem.items"
            :key="itemIndex"
            class="link"
            :to="localizePath(link.url)"
          >
            <span class="text">{{ link.label }}</span>
          </nuxt-link>
        </div>
      </template>
      <div
        v-else
        class="link"
        @click="defineCurrentAction(listItem.url)"
        :class="{'is-active': $route.fullPath.includes(listItem.url)}"
      >
        <atomic-icon :id="listItem.icon"/>
        <div class="text">{{ listItem.label }}</div>
        <div v-if="listItem.counter" class="counter">{{ listItem.counter }}</div>
      </div>
    </div>
    <list-games
      v-if="gameList?.length"
      :items="gameList.slice(0, 5)"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const { localizePath } = useProjectMethods();

  const gameList = computed(() => props.items.find((item) => item?.gameList)?.gameList);

  const open = ref<boolean>(false);

  const toggleOpen = ():void => {
    open.value = !open.value;
  };

  const collapseChildren = () => {
    open.value = false;
  };

  const defineCurrentAction = (href: string):void => {
    collapseChildren();
    if (!href) return;
    // specific actions like open modal etc
    if (!isLoggedIn.value && href === '/betting') {
      showModal('register');
    } else {
      // instead of <nuxt-link :to="href"
      router.push(localizePath(href));
    }
  };

  watchEffect(() => {
    const { name } = router.currentRoute.value;
    open.value = [
      'welcome-package',
      'bonus-pageUrl',
      'locale-welcome-package',
      'locale-bonus-pageUrl',
    ].includes(name);
  });

</script>

<style lang="scss">
.nav-list {
  margin: 0;
  padding: 0;
  grid-gap: rem(4px);
  display: grid;
  user-select: none;

  > .item {
    @extend %flex-column;
  }

  .items {
    @extend %flex-column;
    padding-left: rem(32px);
    grid-gap: rem(4px);
    overflow: hidden;
    max-height: 0;
    transition: max-height .2s ease-in-out;

    .link {
      max-width: rem(176px);

      .text {
        @include upd-font($body-2);
      }
    }

    .link:first-of-type {
      margin-top: rem(4px);
    }
  }

  .link {
    @extend %link;
    @extend %flex-items-center;
    grid-column-gap: #{rem(8px)};
    padding: var(--padding, #{rem(8px)} 0 #{rem(8px)} #{rem(16px)});
    transition: color .2s ease-in-out;
    min-height: rem(40px);
    --color: var(--gray-300);

    .icon {
      --color: var(--gray-400);
    }

    .counter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      @include font($body-1);
      margin-left: auto;
      color: var(--gray-500);
      transition: color .2s ease-in-out;
    }

    &:hover {
      cursor: pointer;
      --color: var(--white);

      .icon {
        --color: var(--white);
      }

      .counter {
        color: var(--gray-300);;
      }
    }

    &:focus, &:active, &.is-active {
      --color: var(--yellow-500);

      .icon {
        --color: var(--yellow-500);
      }
    }

    &.is-open {
      --color: var(--yellow-500);

      .icon {
        --color: var(--yellow-500);
      }

      ~ .items {
        max-height: 100%;
      }
    }

    &.router-link-active {
      --color: var(--yellow-500);
    }
  }

  .text {
    @include font($heading-2);
    @extend %text-elipsis;
    --color: var(--gray-300);
  }

  .btn-toggle {
    --margin-left: auto
  }

  .is-compact & {
    @include media(l) {
      .text, .items, .bage, .btn-toggle, .counter {
        display: none;
      }

      .icon {
        --icon-size: #{rem(24px)};
      }

      .link {
        --padding: 0;
        justify-content: center;
        @include box(40px);
      }
    }
  }
}
</style>
