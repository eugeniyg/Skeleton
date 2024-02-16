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
        :class="{'is-active': route.fullPath === localizePath(listItem.url)}"
      >
        <atomic-icon :id="listItem.icon"/>
        <div class="text">{{ listItem.label }}</div>
        <client-only>
          <div v-if="listItem.counter" class="counter">{{ listItem.counter }}</div>
        </client-only>
      </div>

      <list-games
        v-if="listItem.gameList?.length"
        :items="listItem.gameList.map((game: any) => game.gameIdentity).slice(0, 4)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    items: any;
    isOpen?: boolean;
    accentItems?: boolean;
  }>();

  const router = useRouter();
  const route = useRoute();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const { localizePath } = useProjectMethods();
  const {
    layoutData,
    defaultLocaleLayoutData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const defineCurrentAction = (href: string): void => {
    if (!href) return;
    router.push(localizePath(href));
  };
</script>

<style src="~/assets/styles/components/nav/list.scss" lang="scss"/>
