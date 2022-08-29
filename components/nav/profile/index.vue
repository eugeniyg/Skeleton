<template>
  <nav class="nav-profile" :class="{'is-open': isOpen}">
    <button class="selected" @click="toggle">
      {{ selected?.title }}<atomic-icon id="arrow_expand-close"/>
    </button>

    <div class="items" @mouseleave="close">
      <router-link
        v-for="({ href, title, count }, index) in props.items"
        @click="toggle"
        :key="index"
        class="item"
        :class="{'is-active': $route.path === localizePath(href)}"
        :to="localizePath(href)"
      >
        {{ title }}<span v-if="count" class="count">{{ count }}</span>

        <template v-if="$route.path === localizePath(href)">
          <atomic-icon id="check"/>
        </template>
      </router-link>
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
  const route = useRoute();
  const isOpen = ref<boolean>(false);
  const selected = computed(() => props.items.find((item:any) => localizePath(item.href) === route.path));

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    isOpen.value = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
