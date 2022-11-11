<template>
  <button-base
    class="btn-popup"
    type="ghost"
    size="xs"
    @click="showModal(props.openModal)"
  >
    <div v-html="buttonHtml" />
  </button-base>
</template>

<script setup lang="ts">
  const props = defineProps({
    buttonLabel: {
      type: String,
      default: '',
    },
    openModal: {
      type: String,
      required: true,
    },
  });
  const { replaceContent } = useCoreMethods();
  const buttonHtml = replaceContent(props.buttonLabel, '*');
  const { showModal } = useLayoutStore();
</script>

<style lang="scss">
.btn-popup {
  margin: 0 auto;
  color: var(--white);
  text-decoration: none;
  cursor: pointer;
  @include font($heading-1);

  span {
    color: var(--yellow-500);
  }
}
</style>
