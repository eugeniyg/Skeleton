<template>
  <div class="loyalty-rewards-slider__item" :class="orderClass">
    <div class="loyalty-rewards-slider__item-header">
      <div class="loyalty-rewards-slider__item-images">
        <loyalty-level-logo :level="props.level.order" />

        <div class="loyalty-rewards-slider__item-icon">
          <atomic-image :src="levelIcon" />
        </div>
      </div>

      <div class="loyalty-rewards-slider__item-title">
        <span class="loyalty-rewards-slider__item-title-text">{{ props.level.name }}</span>
        <span class="loyalty-rewards-slider__item-title-number">{{ props.level.order }}</span>
      </div>

      <div class="loyalty-rewards-slider__item-status-points">
        <div class="loyalty-rewards-slider__item-status-points-label">
          <span>
            {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'rewards.statusPointsLabel') }}
          </span>

          <atomic-icon id="info" @click="openModal('loyalty-earn')" />
        </div>

        <div class="loyalty-rewards-slider__item-status-points-value">
          {{ props.level.points }}
        </div>
      </div>
    </div>

    <div class="loyalty-rewards-slider__item-content">
      <div v-for="(reward, index) in levelRewards" :key="index" class="loyalty-rewards-slider__item-reward">
        <div class="loyalty-rewards-slider__item-reward-value" :class="{ '--is-empty': !reward.value }">
          {{ reward.value || '-' }}
        </div>

        <div class="loyalty-rewards-slider__item-reward-label">
          {{ reward.label }}
        </div>
      </div>

      <atomic-divider v-if="levelRewards.length && levelBenefits.length" class="loyalty-rewards-slider__item-divider" />

      <loyalty-level-benefits v-if="levelBenefits.length" :levelBenefits="levelBenefits" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyLevel } from '@skeleton/api/types';
  import type { ILoyaltyPage } from '~/types';

  const props = defineProps<{
    level: ILoyaltyLevel;
  }>();

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const loyaltyStore = useLoyaltyStore();
  const { loyaltyAccount } = storeToRefs(loyaltyStore);
  const { openModal } = useModalStore();

  const completedLevelIcon = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'rewards.completedIcon');
  });

  const activeLevelIcon = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'rewards.activeIcon');
  });

  const lockedLevelIcon = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'rewards.lockedIcon');
  });

  const cardStatus = computed<'completed' | 'active' | 'locked'>(() => {
    if (!isLoggedIn.value) return props.level.order === 1 ? 'active' : 'locked';

    const currenLevel = loyaltyAccount.value?.currentLevel?.order;
    if (currenLevel) {
      if (currenLevel > props.level.order) return 'completed';
      if (currenLevel < props.level.order) return 'locked';
      return 'active';
    } else return 'locked';
  });

  const levelIcon = computed(() => {
    if (cardStatus.value === 'completed') return completedLevelIcon.value;
    if (cardStatus.value === 'active') return activeLevelIcon.value;
    return lockedLevelIcon.value;
  });

  const levelRewards = computed(() => {
    const contentRewards = getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'rewards.levelsRewards');
    return contentRewards?.[props.level.order - 1]?.rewards || [];
  });

  const levelBenefits = computed(() => {
    const contentBenefits = getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'rewards.benefits');
    if (!contentBenefits?.length) return [];
    return contentBenefits.map((benefit: { label: string; levels?: string[] }) => ({
      label: benefit.label,
      checked: benefit.levels?.includes(String(props.level.order)),
    }));
  });

  const orderClass = computed(() => `is-order-${cardStatus.value}`);
</script>
