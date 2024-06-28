<template>
  <div class="quest-empty-active">
    <atomic-image
      class="quest-empty-active__image"
      :src="getContent(infoContent, defaultLocaleInfoContent, 'questsHub.empty.image')"
    />

    <div class="quest-empty-active__title">
      {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.empty.title') }}
    </div>

    <div class="quest-empty-active__description">
      {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.empty.description') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProfileInfo } from "~/types";

const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));
const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/quest/empty-active.scss" lang="scss" />