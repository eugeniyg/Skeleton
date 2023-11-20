<template>
  <div>
    <div
      class="link"
      @click="toggleOpen"
      :class="{'is-open': open }"
    >
      <nuxt-link
        v-if="isDrawerCompact"
        :to="localizePath(props.items[0].url)"
        @click.stop
      >
        <atomic-icon :id="props.icon"/>
      </nuxt-link>

      <atomic-icon v-else :id="props.icon"/>
      <div class="text">{{ props.label }}</div>
      <button-toggle/>
    </div>

    <div class="items">
      <nuxt-link
        v-for="(link, itemIndex) in props.items"
        :key="itemIndex"
        class="link"
        :to="localizePath(link.url)"
      >
        <span class="text">{{ link.label }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  });

  const layoutStore = useLayoutStore();
  const { isDrawerCompact } = storeToRefs(layoutStore);

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const checkUrl = ():boolean => props.items.some((link:any) => localizePath(link.url) === route.fullPath);

  const open = ref<boolean>(checkUrl());
  watch(() => route.fullPath, () => {
    const hasNestedLink = checkUrl();
    open.value = hasNestedLink;
  });

  const toggleOpen = ():void => {
    open.value = !open.value;
  };
</script>
