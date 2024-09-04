<template>
  <div class="bonuses-info-button">
    <span class="bonuses-info-button__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'moreInfo') }}
    </span>

    <atomic-icon id="question" class="bonuses-info-button__icon"/>
  </div>
</template>

<script setup lang="ts">
  import type {IProfileBonuses} from "~/types";

  const { getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));
</script>

<style src="~/assets/styles/components/bonuses/info-button.scss" lang="scss"/>