<template>
  <div class="bonuses-badge-type" :class="`is-${typeContent?.color || 'cashback'}`">
    <atomic-icon :id="typeContent?.icon || 'cashback'" class="bonuses-badge-type__icon" />
    <span class="bonuses-badge-type__label">{{ typeContent?.label || props.mode }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    mode: number;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const modeMap: Record<number, string> = {
    '-1': 'package',
    '1': 'cash',
    '2': 'percentage',
    '3': 'freeSpin',
    '4': 'cashback',
  };

  const typeContent = computed(() => {
    const typesContent = getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'bonuses.types'
    );
    if (!typesContent) return undefined;
    const modeKey = modeMap[props.mode];
    return typesContent[modeKey];
  });
</script>

<style src="~/assets/styles/components/bonuses/badge-type.scss" lang="scss" />
