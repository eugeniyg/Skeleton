<template>
  <div v-if="promotionsContent" class="group-promotions">
    <atomic-icon :id="promotionsContent.icon"/>
    <h2 class="title">{{ promotionsContent.label }}</h2>

    <div class="group-promotions__list">
      <div
        class="group-promotions__item"
        v-for="(promotion, index) in promotionsContent.items"
        :key="index"
      >
        <div class="img" :style="backgroundImage(promotion.image)"/>

        <div class="content">
          <div class="title">{{ promotion.title }}</div>
          <div class="sub-title">{{ promotion.description }}</div>

          <div class="actions">
            <button-base
              type="primary"
              size="md"
              @click="isLoggedIn ? openDepositModal : showModal('register')"
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

  const { globalComponentsContent } = useGlobalStore();
  const promotionsContent:PromotionsContentInterface|undefined = globalComponentsContent?.promotions;

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();

  const backgroundImage = (img:string):string => `background-image:url(${img})`;
</script>

<style lang="scss" src="./style.scss"/>
