<template>
  <div class="nav-mob">
    <button-base class="item" @click.prevent="layoutStore.toggleDrawer()">
      <atomic-icon :id="'menu'" /><span>
        {{ getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'menuLabel') }}
      </span>
    </button-base>

    <button-base
      v-if="getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0')"
      class="item"
      :class="{ active: $route.path === localizePath(getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.url'))}"
      @click="clickItem(getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.url'))"
    >
      <atomic-icon
        :id="getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.icon')"
      /><span>{{ getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.label') }}</span>
    </button-base>

    <button-base class="item is-accent" @click.prevent="clickMainButton">
      <atomic-icon :id="isLoggedIn ? 'wallet' : 'user'" />
      <span>
        {{ isLoggedIn ? headerContent?.depositButton || defaultLocaleHeaderContent?.depositButton
          : headerContent?.loginButton || defaultLocaleHeaderContent?.loginButton }}
      </span>
    </button-base>

    <button-base
      v-for="link in getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items')?.slice(1)"
      :key="link.url"
      class="item"
      :class="{ active: $route.path === localizePath(link.url) }"
      @click="clickItem(link.url)"
    >
      <atomic-icon :id="link.icon" /><span>{{ link.label }}</span>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const router = useRouter();
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();
  const {
    mobileMenuContent,
    defaultLocaleMobileMenuContent,
    headerContent,
    defaultLocaleHeaderContent,
  } = useGlobalStore();
  const { localizePath, getContent } = useProjectMethods();
  const clickItem = (url: string):void => {
    if (url === '/betting') {
      isLoggedIn.value ? router.push(localizePath(url)) : showModal('register');
    } else router.push(localizePath(url));
  };

  const clickMainButton = ():void => {
    isLoggedIn.value ? openDepositModal() : showModal('signIn');
  };
</script>

<style lang="scss">
.nav-mob {
  display: flex;
  position: fixed;
  height: var(--height-nav-mob, rem(64px));
  bottom: var(--bottom-nav-mob, 0);
  left: 0;
  right: var(--right-nav-mob, 0);
  flex-direction: var(--direction-nav-mob);
  padding: rem(8px) rem(8px) rem(16px) rem(8px);
  background-color: var(--black-primary);
  z-index: var(--mob-nav-index, 1);
  visibility: var(--mob-nav-visibility, visible);
  width: var(--width-nav-mob, auto);

  @include media(l) {
    visibility: hidden;
  }

  .item {
    @extend %flex-column;
    justify-content: var(--display-mob-nav-justify, flex-end);
    align-items: center;
    flex-grow: 1;
    text-decoration: none;
    width: 100%;
    height: 100%;
    padding: 0;

    .icon {
      @include box(22px);
      @extend %flex-all-center;
      transition: color .2s ease-in-out;

      --color: var(--white);
    }

    &.is-accent {
      .icon {
        @include box(36px);
        background: var(--gradient-radial);
        padding: rem(6px);
        @include radius(50%);
      }
    }

    span {
      display: var(--display-mob-nav-item, block);
      color: var(--color, var(--white));
      @include font($heading-1);
      transition: color .1s ease-in-out;
    }

    &:not(.is-accent) {
      &:active {
        --color: var(--yellow-500);

        .icon {
          --color: var(--yellow-500);
        }
      }
    }

    &.active {
      .icon, span {
        color: #FFC12E !important;
      }
    }
  }

  .is-mob-nav-vertical & {
    @media (orientation: landscape) {
      top: 0;
      --direction-nav-mob: column;
      --direction-nav-right: auto;
      --height-nav-mob: auto;
      --width-nav-mob: #{rem(64px)};
      --mob-nav-index: 2;
      --display-mob-nav-item: none;
      --display-mob-nav-justify: center;
    }
  }
}
</style>
