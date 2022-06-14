<template>
  <nav class="nav-faq" :class="{'is-open': isOpen}">
    <button class="selected" @click="toggle">
      {{ selected.title }}
      <atomic-icon id="ui-arrow_expand-close"/>
    </button>

    <div class="items" @mouseleave="close">
      <div
        v-for="({ href, title, count }, itemIndex) in props.items"
        :key="itemIndex"
        class="item"
        :class="{'is-active': getCurrentUrl() === href}"
        @click.prevent="() => navigate(href)"
      >
        {{ title }}

        <span v-if="count" class="count">{{ count }}</span>

        <atomic-icon v-if="getCurrentUrl() === href" id="ui-check"/>
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
  const { getCurrentUrl, navigate } = useProjectMethods();
  const isOpen = ref<boolean>(false);
  const selected = computed(() => props.items.filter((item:any) => item.href === getCurrentUrl())[0]);

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
  };
  const close = ():void => {
    isOpen.value = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
