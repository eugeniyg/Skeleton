<template>
  <div class="loyalty-level-logo">
    <atomic-image :src="levelImage || '/img/loyalty/default-level-img.png'" class="loyalty-level-logo__logo" />

    <atomic-image class="loyalty-level-logo__background" src="/img/loyalty/default-level-bg.png" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    level?: number;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const loyaltyStore = useLoyaltyStore();
  const { loyaltyAccount } = storeToRefs(loyaltyStore);

  const levelImage = computed(() => {
    const level = props.level || loyaltyAccount.value?.currentLevel?.order;
    if (!level || level < 1) return undefined;

    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      `loyalty.levelsImages.${level - 1}.imageUrl`
    );
  });
</script>

<style src="~/assets/styles/components/loyalty/level-logo.scss" lang="scss" />
