<template>
  <div v-if="globalComponentsContent?.promotions || defaultLocaleGlobalComponentsContent?.promotions" class="group-promotions">
    <atomic-icon :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'promotions.icon')"/>

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'promotions.label') }}
    </h2>

    <div class="group-promotions__list">
      <div
        class="group-promotions__item"
        v-for="(promotion, index) in promotionsList"
        :key="index"
        :class="{ 'hovered': hoverCard === index }"
        @click="clickCard(index)"
      >
        <atomic-image :src="promotion.image" alt=""/>

        <div class="content">
          <div class="title">{{ promotion.title }}</div>
          <div class="sub-title">{{ promotion.description }}</div>

          <div class="actions">
            <button-base
              type="primary"
              size="md"
              @click="isLoggedIn ? openDepositModal() : showModal('register')"
            >
              {{ promotion.buttonLabel }}
            </button-base>

            <nuxt-link
              class="link-more"
              :to="localizePath(promotion.link.url)"
            >
              {{ promotion.link.label }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script  setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = globalStore;

  const { localizePath, getContent } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();

  const backgroundImage = (img:string):string => `background-image:url(${img})`;
  const hoverCard = ref<number|undefined>(undefined);
  const { isMobile } = storeToRefs(globalStore);
  const clickCard = (index: number):void => {
    if (isMobile.value) {
      hoverCard.value = hoverCard.value === index ? undefined : index;
    }
  };

  const clickOutside = (e:any):void => {
    if (e.target.closest('.group-promotions__item')) return;
    hoverCard.value = undefined;
  };

  const promotionsList = computed(() => {
    if (globalComponentsContent?.promotions?.items?.length) return globalComponentsContent.promotions.items;
    return defaultLocaleGlobalComponentsContent?.promotions?.items || [];
  });

  onMounted(() => {
    document.addEventListener('click', clickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutside);
  });
</script>

<style src="~/assets/styles/components/group/promotions.scss" lang="scss" />

