<template>
  <div class="nav-list">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <template v-if="listItem?.items?.length">
        <div class="link" @click.prevent="toggleOpen" :class="{'is-open': open}">
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

      <div v-else class="link" @click="defineCurrentAction(listItem.url)">
        <atomic-icon :id="listItem.icon"/>
        <div class="text">{{ listItem.label }}</div>
      </div>

      <list-games
        v-if="listItem.gameList?.length"
        :items="listItem.gameList.slice(0, 3)"
      />
    </div>
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

  const open = ref<boolean>(props.isOpen);

  const toggleOpen = ():void => {
    open.value = !open.value;
  };

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const { localizePath } = useProjectMethods();
  const defineCurrentAction = (href: string):void => {
    if (!href) return;
    // specific actions like open modal etc
    if (!isLoggedIn.value && href === '/betting') {
      showModal('register');
    } else {
      // instead of <nuxt-link :to="href"
      router.push(localizePath(href));
    }
  };
</script>

<style lang="scss">
.nav-list {
  margin: 0;
  padding: 0;
  grid-gap: rem(4px);
  display: grid;

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

    .link:first-of-type {
      margin-top: rem(4px);
    }
  }

  .link {
    @extend %link;
    @extend %flex-items-center;
    grid-column-gap: #{rem(8px)};
    padding: var(--padding, #{rem(8px) rem(16px)});
    transition: color .2s ease-in-out;
    min-height: rem(40px);
    --color: var(--gray-300);

    .icon {
      --color: var(--gray-400);
    }

    &:hover {
      cursor: pointer;
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

    &.is-open {
      --color: var(--yellow-500);

      .icon {
        --color: var(--yellow-500);
      }

      ~ .items {
        max-height: 100%;
      }
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
      .text, .items, .bage, .btn-toggle {
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
