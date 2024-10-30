<template>
  <button-base
    class="btn-popup"
    type="ghost"
    size="xs"
    @click="openModal(props.modal)"
  >
    <div v-html="buttonHtml || ''" />
  </button-base>
</template>

<script setup lang="ts">
  const props = defineProps({
    buttonLabel: {
      type: String,
      default: '',
    },
    modal: {
      type: String,
      required: true,
    },
  });
  const { replaceContent } = useProjectMethods();
  const buttonHtml = replaceContent(props.buttonLabel, '*');
  const { openModal } = useModalStore();
</script>

<style src="~/assets/styles/components/button/popup.scss" lang="scss" />

