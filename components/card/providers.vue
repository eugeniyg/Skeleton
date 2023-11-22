<template>
  <nuxt-link
    class="card-providers"
    :to="localizePath(`/games?provider=${props.providerData.id}`)"
  >
    <atomic-image
      class="img"
      :src="`/img/providers/${props.providerData.identity}.svg`"
    />
  </nuxt-link>
</template>

<script setup lang="ts">
  import type { IGameProvider } from "@skeleton/core/types";

  const props = defineProps<{
    providerData: IGameProvider;
  }>();

  const router = useRouter();

  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/card/providers.scss" lang="scss" />

