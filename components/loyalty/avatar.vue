<template>
  <div class="loyalty-avatar">
    <atomic-image v-if="!props.onlyLevel" :src="avatarImage" class="loyalty-avatar__user-img" />

    <div class="loyalty-avatar__level">
      <atomic-image
        v-if="props.onlyLevel"
        class="loyalty-avatar__level-bg"
        src="/img/loyalty/default-level-bg.png"
      />

      <atomic-image
        class="loyalty-avatar__level-front"
        :src="levelImage || '/img/loyalty/default-level-img.png'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    onlyLevel?: boolean;
  }>()

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = storeToRefs(globalStore);

  const avatarImage = computed(() => {
    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'loyalty.playerAvatar'
    ) || '/img/avatar-bg.png';
  })

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
  })
</script>

<style src="~/assets/styles/components/loyalty/avatar.scss" lang="scss"/>