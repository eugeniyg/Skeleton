<template>
  <button-base class="btn-popup" type="ghost" size="xs" @click="openModal(props.modal)">
    <div v-html="buttonHtml || ''" />
  </button-base>
</template>

<script setup lang="ts">
  import { replaceContent } from '@skeleton/helpers/contentMethods';

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
  const buttonHtml = replaceContent(props.buttonLabel, '*');
  const { openModal } = useModalStore();
</script>

<style src="~/assets/styles/components/button/popup.scss" lang="scss" />
