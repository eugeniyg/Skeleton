<template>
  <nav v-click-outside="close" class="nav-profile" :class="{ 'is-open': isOpen }">
    <button class="selected" @click="toggle">{{ selected?.title }}<atomic-icon id="arrow_expand-close" /></button>

    <div class="items">
      <atomic-link
        v-for="(item, index) in sortedMenu"
        :key="index"
        class="item"
        :class="{ 'is-active': route.path === localizePath(item.url) }"
        :href="item.url"
        @click="close"
      >
        {{ item.title }}

        <client-only>
          <span v-if="item.id === 'bonuses' && bonusesCount" class="count">
            {{ bonusesCount }}
          </span>

          <span v-if="item.id === 'notifications' && unreadCount" class="count">
            {{ unreadCount }}
          </span>
        </client-only>

        <template v-if="route.path === localizePath(item.url)">
          <atomic-icon id="check" />
        </template>
      </atomic-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import type { IPageMeta } from '~/types';

  const props = defineProps<{
    items: { id: string; title: string; url: string; pageMeta: IPageMeta }[];
  }>();

  const sortOrder = [
    'info',
    'wallet',
    'bonuses',
    'notifications',
    'documents',
    'verification',
    'security',
    'history',
    'limits',
  ];

  const sortedMenu = computed(() => {
    return [...props.items].sort((prev, next) => {
      const prevIndex = sortOrder.indexOf(prev.id);
      const nextIndex = sortOrder.indexOf(next.id);
      return prevIndex - nextIndex;
    });
  });

  const route = useRoute();
  const isOpen = ref<boolean>(false);
  const selected = computed(() => props.items.find((item: any) => localizePath(item.url) === route.path));

  const bonusStore = useBonusStore();
  const { bonusesCount } = storeToRefs(bonusStore);

  const notificationStore = useNotificationStore();
  const { unreadCount } = storeToRefs(notificationStore);

  const toggle = (): void => {
    isOpen.value = !isOpen.value;
  };

  const close = (): void => {
    if (isOpen.value) isOpen.value = false;
  };
</script>

<style src="~/assets/styles/components/nav/profile.scss" lang="scss" />
