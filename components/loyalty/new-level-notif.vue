<template>
  <div class="new-level-notif" :class="{ 'pwa-notif-opened': pwaVisible }">
    <atomic-image
      :key="levelImage"
      class="new-level-notif__level-img"
      :src="levelImage || '/img/loyalty/default-level-img.png'"
    />
    <div v-if="notifTitle" class="new-level-notif__title">{{ notifTitle }}</div>
    <button-modal-close @close="loyaltyStore.closeLevelNotification" />
  </div>
</template>

<script setup lang="ts">
  import camelCase from 'lodash/camelCase';

  const loyaltyStore = useLoyaltyStore();
  const { currentLevelName, loyaltyAccount } = storeToRefs(loyaltyStore);
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    currentLocaleModalsContent,
    defaultLocaleModalsContent,
  } = useGlobalStore();
  const { modalsList } = useModalStore();
  const currentLocaleLoyaltyLevelContent = currentLocaleModalsContent?.[camelCase(modalsList['loyalty-level'].content)];
  const defaultLocaleLoyaltyLevelContent = defaultLocaleModalsContent?.[camelCase(modalsList['loyalty-level'].content)];

  const notifTitle = computed(() => {
    const titleContent = getContent(
      currentLocaleLoyaltyLevelContent,
      defaultLocaleLoyaltyLevelContent,
      'gamePageNotification'
    );
    if (!titleContent) return undefined;
    const levelOrder = String(loyaltyAccount.value?.currentLevel?.order || '');
    return titleContent.replace('{levelName}', currentLevelName.value).replace('{levelOrder}', levelOrder);
  });

  const levelImage = computed(() => {
    const currentLevel = loyaltyAccount.value?.currentLevel?.order;
    if (currentLevel) {
      return getContent(
        globalComponentsContent,
        defaultLocaleGlobalComponentsContent,
        `loyalty.levelsImages.${currentLevel - 1}.imageUrl`
      );
    }

    return undefined;
  });

  const pwaVisible = ref(false);
  onMounted(() => {
    const pwaNotif = document.querySelector('header .pwa');
    pwaVisible.value = !!pwaNotif;
  });
</script>

<style src="~/assets/styles/components/loyalty/new-level-notif.scss" lang="scss" />
