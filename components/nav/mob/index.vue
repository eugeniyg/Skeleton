<template>
  <div class="nav-mob">
    <a
      v-for="({ title, icon, href, isAccent, method }, itemIndex) in props.items"
      :key="itemIndex"
      class="item"
      :class="{'is-accent': isAccent}"
      @click.prevent="clickItem(method)"
      :href="href"
    >
      <atomic-icon :id="icon"/><span>{{ title }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [
        {
          title: 'Menu',
          icon: 'ui-menu',
          href: '#',
          method: 'toggleDrawer',
        },
        {
          title: 'Casino',
          icon: 'cherry',
          href: '#',
        },
        {
          title: 'Deposit',
          icon: 'ui-wallet',
          href: '#',
          isAccent: true,
        },
        {
          title: 'Sport',
          icon: 'sport',
          href: '#',
        },
        {
          title: 'Support',
          icon: 'live-support',
          href: '#',
        },
      ],
    },
  });
  const layoutStore = useLayoutStore();

  // eslint-disable-next-line no-unused-vars
  function toggleDrawer():void {
    layoutStore.toggleDrawer();
  }

  function clickItem(method?:string):void {
    if (method) layoutStore[method]();
  }
</script>

<style lang="scss" src="./style.scss"/>
