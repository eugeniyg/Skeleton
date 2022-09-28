<template>
  <div v-if="promotionsContent" class="group-promotions">
    <atomic-icon :id="promotionsContent.icon"/>
    <h2 class="title">{{ promotionsContent.label }}</h2>

    <div class="group-promotions__list">
      <div
        class="group-promotions__item"
        v-for="(promotion, index) in promotionsContent.items"
        :key="index"
        :class="{ 'hovered': hoverCard === index }"
        @click="clickCard(index)"
      >
        <div class="img" :style="backgroundImage(promotion.image)"/>

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
  import { PromotionsContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { globalComponentsContent } = globalStore;
  const promotionsContent:PromotionsContentInterface|undefined = globalComponentsContent?.promotions;

  const { localizePath } = useProjectMethods();
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

  const clickOutside = (e):void => {
    if (e.target.closest('.group-promotions__item')) return;
    hoverCard.value = undefined;
  };

  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
    setTimeout(() => {
      document.addEventListener('click', clickOutside);
    }, 100);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutside);
  });
</script>

<style lang="scss" src="./style.scss"/>
