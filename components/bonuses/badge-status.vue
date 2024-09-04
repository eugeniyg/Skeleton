<template>
  <div class="bonuses-badge-status" :class="`is-${componentStatus}`">
    <atomic-icon id="stars" class="bonuses-badge-status__icon" />

    <span class="bonuses-badge-status__label">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, `statuses.${componentStatus}`) }}
    </span>

    <span v-if="props.isDeposit" class="bonuses-badge-status__text">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, `statuses.nextDeposit`) }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from "~/types";
  import type {IBonus, IPlayerBonus, IPlayerFreeSpin} from "@skeleton/core/types";

  const props = defineProps<{
    bonusInfo: IPlayerBonus|IPlayerFreeSpin|IBonus;
    isDeposit?: boolean;
  }>();

  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const componentStatus = computed(() => {
    if (props.isDeposit || props.bonusInfo.status === 1) return 'available';
    return 'active';
  })
</script>

<style src="~/assets/styles/components/bonuses/badge-status.scss" lang="scss"/>