<template>
  <div>
    <div class="promotion">
      <h1 class="title">{{ welcomeContent?.title }}</h1>
      <h4 class="sub-title">{{ welcomeContent?.description }}</h4>

      <div v-if="welcomeContent?.howGet" class="steps">
        <div class="title">{{ welcomeContent.howGet.label }}</div>

        <div class="items">
          <div
            class="item"
            :key="index"
            v-for="(item, index) in howGetItems"
          >
            <span class="number">{{ index + 1 }}</span>
            <p class="text">{{ item }}</p>
          </div>
        </div>

        <img v-if="welcomeContent?.howGet.image" class="img" :src="welcomeContent?.howGet.image" />
      </div>

      <atomic-divider />

      <div class="welcome">
        <h4 class="title">{{ welcomeContent?.welcome.label }}</h4>

        <div v-if="welcomeContent?.welcome.items?.length" class="items">
          <div
            class="item"
            :key="itemIndex"
            v-for="(card, itemIndex) in welcomeContent.welcome.items"
          >
            <div class="title">{{ card.title }}</div>
            <div class="sub-title">{{ card.topLabel }}</div>
            <img class="img" :src="card.image" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openDepositModal() : showModal('register')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base
                type="ghost"
                size="md"
                :url="card.link.url"
              >
                {{ card.link.label }}
              </button-base>
            </div>

            <div class="arrow">
              <atomic-icon id="arrow_expand-close" />
            </div>
          </div>
        </div>
      </div>

      <atomic-divider />

      <div class="bonuses">
        <h4 class="title">{{ welcomeContent?.bonuses.label }}</h4>

        <div v-if="welcomeContent?.bonuses.items?.length" class="items">
          <div
            class="item"
            :key="itemIndex"
            v-for="(card, itemIndex) in welcomeContent.bonuses.items"
          >
            <div class="title">{{ card.subtitle }}</div>
            <div class="sub-title">{{ card.title }}</div>
            <img class="img" :src="card.image" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openDepositModal() : showModal('register')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base
                type="ghost"
                size="md"
                :url="card.link.url"
              >
                {{ card.link.label }}
              </button-base>
            </div>
          </div>
        </div>
      </div>
    </div>
    <atomic-seo-text v-if="welcomeContent?.seo?.text" v-bind="welcomeContent?.seo?.text" />
  </div>
</template>

<script setup lang='ts'>
  import { storeToRefs } from 'pinia';
  import { WelcomePageInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const welcomeContentRequest = await useAsyncData('welcomeContent', () => queryContent(`welcome-bonuses/${currentLocale.value.code}`).findOne());
  const welcomeContent:WelcomePageInterface|undefined = welcomeContentRequest.data.value as WelcomePageInterface;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(welcomeContent?.seo);
  let howGetItems = [];
  if (welcomeContent?.howGet) howGetItems = [welcomeContent.howGet.first, welcomeContent.howGet.second, welcomeContent.howGet.third];

  const profileStore = useProfileStore();
  const { openDepositModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"></style>
