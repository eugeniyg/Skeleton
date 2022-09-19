<template>
  <div class="tabs">
    <div class="header" v-if="props.items.length > 1">
      <button-base
        v-for="({ icon, title, id }, itemIndex) in props.items"
        :key="itemIndex"
        :class="{'is-active': props.selected === id}"
        @click="emit('select-tab', id)"
      >
        <atomic-icon :id="icon" v-if="icon"/>{{ title }}
      </button-base>
    </div>

    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => ([
        {
          title: 'favorites',
          icon: 'heart',
          id: 'favorites',
          isActive: true,
        },
        // {
        //   title: 'Recently played',
        //   icon: 'history',
        //   id: 'recently-played',
        // },
      ]),
    },
    selected: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['select-tab']);
</script>

<style lang="scss" src="./style.scss"/>
