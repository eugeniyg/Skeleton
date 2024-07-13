<template>
  <div class="loyalty-rewards">
    <div class="loyalty-rewards__title">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'rewards.title') }}
    </div>

    <div class="loyalty-rewards__description">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'rewards.description') }}
    </div>

    <loyalty-rewards-slider
      v-if="loyaltyLevels.length"
      :levels="loyaltyLevels"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  import type {ILoyaltyLevel} from "@skeleton/core/types";

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));

  const { getContent } = useProjectMethods();

  const loyaltyLevels = ref<ILoyaltyLevel[]>([]);
  const getLevels = async (): Promise<void> => {
    try {
      const { getLoyaltyLevels } = useCoreProfileApi();
      const { data } = await getLoyaltyLevels({ sortBy: 'order', sortOrder: 'asc' });
      loyaltyLevels.value = data;
    } catch {
      console.error('Failed to load loyalty levels')
    }
  }

  onMounted(async () => {
    await getLevels();
  })
</script>

<style src="~/assets/styles/components/loyalty/rewards.scss" lang="scss"/>