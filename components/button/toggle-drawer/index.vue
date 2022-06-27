<template>
  <div class="toggle-drawer" :class="{'is-active' : props.isActive}">
    <button-base @click="emit('toggle-minimize')" data-action="minimize">
      <atomic-icon id="ui-arrow_expand-close"/>
    </button-base>
    <button-base @click="emit('toggle-open')" data-action="open">
      <atomic-icon id="ui-arrow_expand-close"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['toggle']);
</script>

<style lang="scss" src="./style.scss"/>
