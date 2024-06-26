<template>
  <div class="quest-hub-card">
    <div class="quest-hub-card__body">
      <div class="quest-hub-card__img">
        <atomic-image :src="props.img"/>
      </div>

      <div class="quest-hub-card__title">
        <span>{{ props.title }}</span>

        <!-- need for feature
        <div class="quest-hub-card__tooltip">
          <atomic-icon id="info"/>
        </div>
        -->

      </div>
      <div class="quest-hub-card__amount">
        <span class="quest-hub-card__amount-value">0.00000013</span>
        <span class="quest-hub-card__amount-currency">mBTC</span>
        <span class="quest-hub-card__amount-more" @click="showModal('questAccumulatedRewards')">+4 more</span>

      </div>
      <span class="quest-hub-card__arrow" @click="showModal('questTasks')">
        <atomic-icon id="arrow_expand-close"/>
      </span>
    </div>

    <hr v-if="props.showDivider" class="quest-hub-card__divider">
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  img: string;
  showDivider: boolean;
}>();

const { showModal } = useLayoutStore();
</script>

<style src="~/assets/styles/components/quest/hub-card.scss" lang="scss"/>