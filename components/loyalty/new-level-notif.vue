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
  import { storeToRefs } from 'pinia';
  import modalsMap from '@skeleton/maps/modalsMap.json';
  import type { IModalSettings } from '@skeleton/types';
  const modalsList: Record<string, IModalSettings> = modalsMap;

  const loyaltyStore = useLoyaltyStore();
  const { getContent } = useProjectMethods();
  const { currentLevelName, loyaltyAccount } = storeToRefs(loyaltyStore);
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const signInContentParams = {
    contentKey: 'modal-loyalty-level',
    contentRoute: ['modals', modalsList['loyalty-level'].content as string],
  };
  const { getContentData } = useContentLogic(signInContentParams);
  const { data: loyaltyLevelContent } = await useLazyAsyncData(getContentData);

  const notifTitle = computed(() => {
    const titleContent = getContent(
      loyaltyLevelContent.value?.currentLocaleData,
      loyaltyLevelContent.value?.defaultLocaleData,
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
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
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
