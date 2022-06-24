<template>
  <div v-if="promotion" class="promotion">
    <h1 class="title">{{ promotion.title }}</h1>
    <h4 class="sub-title">{{ promotion.subTitle }}</h4>
    <div class="steps">
      <div class="title">{{ promotion.howToGet.title }}</div>
      <div class="items">
        <div
          class="item"
          :key="index"
          v-for="(item, index) in promotion.howToGet.items"
        >
          <span class="number">{{ index + 1 }}</span>
          <p class="text">{{ item }}</p>
        </div>
      </div>
      <img class="img" :src="`/img${promotion.howToGet.src}`" />
    </div>
    <atomic-divider />
    <div class="welcome">
      <h4 class="title">{{ promotion.welcomePackage.title }}</h4>
      <div class="items">
        <div
          class="item"
          :key="itemIndex"
          v-for="({ title, subTitle, src, actions }, itemIndex) in promotion
            .welcomePackage.items"
        >
          <div class="title">{{ title }}</div>
          <div class="sub-title">{{ subTitle }}</div>
          <img class="img" :src="`/img${src}`" />
          <div class="actions">
            <button-base type="primary" size="md" @click="isLoggedIn ? openDepositModal() : showModal('register')">{{
              actions.primary
            }}</button-base>
            <button-base type="ghost" size="md" :url="actions.secondary.href">{{
              actions.secondary.title
            }}</button-base>
          </div>
          <div class="arrow">
            <atomic-icon id="ui-arrow_expand-close" />
          </div>
        </div>
      </div>
    </div>
    <atomic-divider />
    <div class="bonuses">
      <h4 class="title">{{ promotion.weeklyBonuses.title }}</h4>
      <div class="items">
        <div
          class="item"
          :key="itemIndex"
          v-for="({ title, subTitle, src, actions }, itemIndex) in promotion
            .weeklyBonuses.items"
        >
          <div class="title">{{ title }}</div>
          <div class="sub-title">{{ subTitle }}</div>
          <img class="img" :src="`/img${src}`" />
          <div class="actions">
            <button-base type="primary" size="md" @click="isLoggedIn ? openDepositModal() : showModal('register')">{{
              actions.primary
            }}</button-base>
            <button-base type="ghost" size="md" :url="actions.secondary.href">{{
              actions.secondary.title
            }}</button-base>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { storeToRefs } from 'pinia';

  const fakeStore = useFakeStore();
  const profileStore = useProfileStore();

  const { promotion } = fakeStore;
  const { openDepositModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"></style>
