<template>
  <button class="btn-toggle-type" @click.prevent="toggle">
    <atomic-icon :id="icon"/>
  </button>
</template>

<script setup lang="ts">
  const items = {
    text: 'ui-eye-visibility',
    password: 'ui-eye-invisible',
  };
  const hide = ref<boolean>(true);
  const type = computed(() => Object.keys(items)[Number(hide.value)]);
  const icon = computed(() => Object.values(items)[Number(hide.value)]);

  const emit = defineEmits(['change-type']);
  const toggle = ():void => {
    hide.value = !hide.value;
    emit('change-type', type.value);
  };
</script>

<style lang="scss" src="./style.scss"/>
