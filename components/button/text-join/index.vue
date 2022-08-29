<template>
  <button-base
    class="btn-text-join"
    type="ghost"
    size="xs"
    @click="showModal('register')"
  >
    Don't have an account?<span>Join</span>
  </button-base>
</template>

<script setup lang="ts">
  const { showModal } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss" />
