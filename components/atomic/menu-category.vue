<template>
  <div>
    <div class="link" :class="{ 'is-open': open }" @click="toggleOpen">
      <atomic-link
        v-if="isDrawerCompact"
        :target-blank="props.items[0]?.targetBlank"
        :href="props.items[0].url"
        @click.stop
      >
        <atomic-svg v-if="props?.displayCustomIcon && props?.customIcon" :src="props?.customIcon" />
        <atomic-icon v-else :id="props.icon ? props?.icon : 'dot-md'" />
      </atomic-link>

      <template v-else>
        <atomic-svg v-if="props.displayCustomIcon && props?.customIcon" :src="props?.customIcon" />
        <atomic-icon v-else :id="props.icon ? props?.icon : 'dot-md'" />
      </template>

      <div class="text">{{ props.label }}</div>
      <button-toggle />
    </div>

    <div class="items">
      <atomic-link
        v-for="(link, itemIndex) in props.items"
        :key="itemIndex"
        class="link"
        :href="link.url"
        :target-blank="link?.targetBlank"
      >
        <span class="text">{{ link.label }}</span>
      </atomic-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string;
    icon: string;
    displayCustomIcon?: boolean;
    customIcon?: string;
    items: any[];
  }>();

  const layoutStore = useLayoutStore();
  const { isDrawerCompact } = storeToRefs(layoutStore);

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const checkUrl = (): boolean => props.items.some((link: any) => localizePath(link.url) === route.fullPath);

  const open = ref<boolean>(checkUrl());
  watch(
    () => route.fullPath,
    () => {
      const hasNestedLink = checkUrl();
      open.value = hasNestedLink;
    }
  );

  const toggleOpen = (): void => {
    open.value = !open.value;
  };
</script>
