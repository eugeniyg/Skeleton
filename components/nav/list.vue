<template>
  <div class="nav-list" :class="{'nav-list--items-accent': props.accentItems}">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <atomic-cta-menu-item
        v-if="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.topMenu.integratedElement.isShow') &&
        Number(getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.topMenu.integratedElement.order')) === index"
        v-bind="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.topMenu.integratedElement')"
      />

      <atomic-menu-category v-if="listItem?.items?.length" v-bind="listItem"/>
      <div
        v-else
        class="link"
        @click="defineCurrentAction(listItem.url)"
        :class="{'is-active': $route.fullPath === localizePath(listItem.url)}"
      >
        <atomic-icon :id="listItem.icon"/>
        <div class="text">{{ listItem.label }}</div>
        <client-only>
          <div v-if="listItem.counter" class="counter">{{ listItem.counter }}</div>
        </client-only>
      </div>

      <list-games
        v-if="listItem.gameList?.length"
        :items="listItem.gameList.map((game) => game.gameIdentity).slice(0, 4)"
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
    accentItems: {
      type: Boolean,
      default: false,
    }
  });

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const { localizePath } = useProjectMethods();
  const {
    layoutData,
    defaultLocaleLayoutData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const defineCurrentAction = (href: string): void => {
    if (!href) return;
    // specific actions like open modal etc
    if (!isLoggedIn.value && href === '/betting') showModal('register');
    // instead of <nuxt-link :to="href"
    router.push(localizePath(href));
  };
</script>

<style src="~/assets/styles/components/nav/list.scss" lang="scss"/>
