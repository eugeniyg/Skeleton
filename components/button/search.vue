<template>
  <button
    class="btn-search"
    :class="{'is-active': active}"
    @click="emit('show-search')"
  >
    <atomic-icon id="search"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['show-search']);

  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const active = computed(() => props.isActive);
</script>

<style src="~/assets/styles/components/button/search.scss" lang="scss" />

