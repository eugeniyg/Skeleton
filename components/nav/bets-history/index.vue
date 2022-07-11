<template>
  <div class="nav-bets-history">
    <div
      class="item"
      v-for="{ title, icon, id } in props.items"
      :key="id"
      :class="{'is-active': id === props.selected}"
      @click="emit('select', id)"
    >
      <atomic-icon :id="icon"/>{{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [
        {
          title: 'Casino',
          icon: 'cherry',
          id: 'casino',
          isActive: true,
        },
        {
          title: 'Sports',
          icon: 'sport',
          id: 'betting',
        },
      ],
    },
    selected: {
      type: String,
      default: 'casino',
    },
  });
  const emit = defineEmits(['select']);
</script>

<style lang="scss" src="./style.scss"/>
