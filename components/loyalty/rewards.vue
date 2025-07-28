<template>
  <div class="loyalty-rewards">
    <div class="loyalty-rewards__title">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'rewards.title') }}
    </div>

    <div class="loyalty-rewards__description">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'rewards.description') }}
    </div>

    <client-only>
      <loyalty-rewards-slider v-if="loyaltyLevels.length" :levels="loyaltyLevels" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  import type { ILoyaltyLevel } from '@skeleton/api/types';
  import { getLoyaltyLevels } from '@skeleton/api/retention';

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));

  const loyaltyLevels = ref<ILoyaltyLevel[]>([]);
  const getLevels = async (): Promise<void> => {
    try {
      const { data } = await getLoyaltyLevels({ sortBy: 'order', sortOrder: 'asc' });
      loyaltyLevels.value = data;
    } catch {
      console.error('Failed to load loyalty levels');
    }
  };

  onMounted(async () => {
    await getLevels();
  });
</script>

<style src="~/assets/styles/components/loyalty/rewards.scss" lang="scss" />
