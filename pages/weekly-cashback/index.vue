<template>
  <div v-if="bonusPage" class="bonus-page">
    <div class="header">
      <img class="img" :src="`/img${bonusPage.src}`" alt="" />
    </div>
    <div class="content">
      <h1 class="title">{{ bonusPage.title }}</h1>
      <h3 class="sub-title">{{ bonusPage.subTitle }}</h3>
      <p class="description">{{ bonusPage.description }}</p>
      <h4 class="list-title">{{ bonusPage.list.title }}</h4>
      <ol>
        <template v-for="(item, itemIndex) in bonusPage.list.items">
          <li v-if="!Array.isArray(item)" :key="itemIndex">{{ item }}</li>
          <ul v-else>
            <li v-for="(item, itemIndex) in item" :key="itemIndex">
              {{ item }}
            </li>
          </ul>
        </template>
      </ol>
      <button-base
        type="primary"
        size="lg"
        @click="isLoggedIn ? openDepositModal() : showModal('register')"
      >Get bonus</button-base>
      <atomic-detail
        :title="bonusPage.detail.title"
        :items="bonusPage.detail.items"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { bonusPage } = useFakeStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openDepositModal, showModal } = useLayoutStore();
</script>

<style lang="scss" src="./style.scss"></style>
