<template>
  <div class="loyalty-avatar" :class="`loyalty-avatar--${props.size}`">
    <atomic-image :src="avatarImage" class="loyalty-avatar__user-img" />
    <atomic-image
      v-if="loyaltyEnabled"
      class="loyalty-avatar__level"
      :src="levelImage || '/img/loyalty/default-level-img.png'"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    size: 'sm' | 'md' | 'lg';
  }>();

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const runtimeConfig = useRuntimeConfig();
  const loyaltyEnabled = runtimeConfig.public?.loyaltyEnabled;

  const avatarImage = computed(() => {
    return (
      getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'commonContent.playerMascot'
      ) || '/img/avatar-bg.png'
    );
  });

  const loyaltyStore = useLoyaltyStore();
  const { loyaltyAccount } = storeToRefs(loyaltyStore);
  const levelImage = computed(() => {
    const currentLevel = loyaltyAccount.value?.currentLevel?.order;
    if (currentLevel) {
      return getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        `loyalty.levelsImages.${currentLevel - 1}.imageUrl`
      );
    }

    return undefined;
  });
</script>

<style src="~/assets/styles/components/loyalty/avatar.scss" lang="scss" />
