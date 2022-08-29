<template>
  <button-base
    class="btn-forgot-pass"
    type="ghost"
    size="xs"
    @click="showModal('forgotPass')"
  >
    Forgot Password?
  </button-base>
</template>

<script setup lang="ts">
  const { showModal } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss" />
