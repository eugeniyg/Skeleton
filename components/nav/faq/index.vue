<template>
  <nav class="nav-faq" :class="{'is-open': isOpen}">
    <button class="selected" @click="toggle">
      {{ selected?.title }}
      <atomic-icon id="arrow_expand-close"/>
    </button>

    <div class="items" @mouseleave="close">
      <div
        v-for="({ icon, href, title, count }, itemIndex) in props.items"
        :key="itemIndex"
        class="item"
        :class="{'is-active': $route.path === localizePath(href) }"
        @click.prevent="select(href)"
      >
        <atomic-icon :id="icon" />
        {{ title }}
        <span v-if="count" class="count">{{ count }}</span>
        <atomic-icon v-show="$route.path === localizePath(href)" id="check"/>
      </div>
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
  const isOpen = ref<boolean>(false);
  const route = useRoute();
  const selected = computed(() => props.items.find((item:any) => localizePath(item.href) === route.path));

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    isOpen.value = false;
  };

  const router = useRouter();
  const select = (val) => {
    router.push(localizePath(val));
    close();
  };
</script>

<style lang="scss" src="./style.scss"/>
