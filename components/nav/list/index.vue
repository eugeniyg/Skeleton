<template>
  <div class="nav-list" :class="{'is-compact' : props.isCompact}">
    <div v-for="({ href, title, icon, bage, items, list }, index) in props.items" :key="index" class="item">
      <template v-if="items">
        <div class="link" @click.prevent="toggleOpen" :class="{'is-open': open}">
          <atomic-icon :id="icon"/>
          <div class="text">{{ title }}</div>
          <button-toggle/>
        </div>

        <div class="items">
          <nuxt-link
            v-for="({ title }, itemIndex) in items"
            :key="itemIndex"
            class="link"
            :to="href"
          >
            <span class="text">{{ title }}</span>
          </nuxt-link>
        </div>
      </template>

      <nuxt-link v-else class="link" :to="href">
        <atomic-icon :id="icon"/>
        <div class="text">{{ title }}</div>
        <atomic-bage v-if="bage" :variant="bage.variant">{{ bage.text }}</atomic-bage>
      </nuxt-link>

      <list-turbo-games v-if="list" :items="list" :is-compact="props.isCompact"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const open = ref<boolean>(props.isOpen);

  const toggleOpen = ():void => {
    open.value = !open.value;
  };
</script>

<style lang="scss" src="./style.scss"/>
