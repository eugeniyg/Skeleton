<template>
  <div class="bonuses-badge-status" :class="`is-${props.status}`">
    <atomic-icon id="stars" class="bonuses-badge-status__icon" />

    <span class="bonuses-badge-status__label">
      {{ statusLabel }}
    </span>

    <span v-if="props.status === 'available-deposit'" class="bonuses-badge-status__text">
      {{
        getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.availability.nextDeposit')
      }}
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    status: 'active' | 'available' | 'available-deposit';
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const statusLabel = computed<string | undefined>(() => {
    const contentKey = props.status.includes('available') ? 'available' : 'active';
    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      `bonuses.availability.${contentKey}`
    );
  });
</script>

<style src="~/assets/styles/components/bonuses/badge-status.scss" lang="scss" />
