<template>
  <a
    class="notification"
    href="#"
    :class="{'is-active': props.isActive, 'is-shown': isShown}"
    @click.prevent="toggle"
    @focusout="isShown = false"
  >
    <atomic-icon id="notification"/>
    <atomic-bulb v-if="props.isActive"/>
  </a>
</template>

<script setup lang="ts">
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });
  const isShown = ref<boolean>(false);

  function toggle(): void {
    setTimeout(() => {
      isShown.value = !isShown.value;
    }, 200);
  }
</script>

<style src="~/assets/styles/components/atomic/notification.scss" lang="scss" />
