<template>
  <div class="cta-menu">
    <template v-for="(item, index) in props.items" :key="index">
      <div v-if="item.url.includes('quests-hub=true')" class="cta-menu__item" @click="openQuestsHub">
        <span class="cta-menu__title">{{ item.title }}</span>
        <span class="cta-menu__sub-title">{{ item.subTitle }}</span>
        <atomic-image class="cta-menu__img" :src="item.image" />
      </div>

      <atomic-link
        v-else
        :key="item.title"
        :href="item.url"
        :target-blank="item.targetBlank"
        class="cta-menu__item"
        :class="{ 'is-active': route.path === localizePath(item.url) }"
      >
        <span class="cta-menu__title">{{ item.title }}</span>
        <span class="cta-menu__sub-title">{{ item.subTitle }}</span>
        <atomic-image class="cta-menu__img" :src="item.image" />
      </atomic-link>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { ISiteSidebar } from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['ctaMenu']['items'];
  }>();

  const route = useRoute();
  const { localizePath } = useProjectMethods();
  const { openModal } = useModalStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const openQuestsHub = (): void => {
    if (isLoggedIn.value) openModal('quests-hub');
    else openModal('sign-in');
  };
</script>

<style src="~/assets/styles/components/cta-menu.scss" lang="scss" />
