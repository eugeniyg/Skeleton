<template>
  <div class="documents-instruction">
    <div class="documents-instruction__img-container">
      <atomic-image
        class="documents-instruction__image"
        :src="props.instructionData.image"
      />

      <atomic-image
        class="documents-instruction__icon"
        :src="props.instructionData.icon"
      />
    </div>

    <div class="documents-instruction__description">
      {{ props.instructionData.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPhotoInstruction } from "~/types";

  const props = defineProps<{
    instructionData: IPhotoInstruction;
  }>();
</script>

<style src="~/assets/styles/components/documents/instruction.scss" lang="scss" />
