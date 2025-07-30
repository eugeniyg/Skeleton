<template>
  <div class="how-it-works">
    <div class="how-it-works__title">
      {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'title') }}
    </div>

    <div class="how-it-works__description">
      {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'description') }}
    </div>

    <div class="how-it-works__container">
      <atomic-image
        :src="getContent(props.currentLocaleContent, props.defaultLocaleContent, 'image')"
        class="how-it-works__image"
      />

      <ul v-if="listItems.length" class="how-it-works__list">
        <li
          v-for="(item, index) in listItems"
          :key="index"
          class="how-it-works__list-item"
          :class="{ 'is-numeric': !item.image }"
        >
          <atomic-image v-if="item.image" class="how-it-works__list-item-icon" :src="item.image" />

          <div v-else class="how-it-works__list-item-icon">
            {{ index + 1 }}
          </div>

          <div class="how-it-works__list-item-content">
            <div class="how-it-works__list-item-title">
              {{ item.title }}
            </div>

            <div class="how-it-works__list-item-description">
              {{ item.description }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <button-base v-if="blockButton" type="primary" size="lg" @click="clickButton">
      {{ blockButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { IHowItWorks } from '~/types';

  const props = defineProps<{
    currentLocaleContent: Maybe<IHowItWorks>;
    defaultLocaleContent: Maybe<IHowItWorks>;
  }>();

  const listItems = computed(() => {
    return getContent(props.currentLocaleContent, props.defaultLocaleContent, 'items') || [];
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();

  const loadingModal = ref(false);
  const clickButton = async (): Promise<void> => {
    if (loadingModal.value) return;

    loadingModal.value = true;
    if (isLoggedIn.value) await openWalletModal('deposit');
    else await openModal('sign-in');
    loadingModal.value = false;
  };

  const blockButton = computed(() => {
    return getContent(props.currentLocaleContent, props.defaultLocaleContent, 'button');
  });
</script>

<style src="~/assets/styles/components/how-it-works.scss" lang="scss" />
