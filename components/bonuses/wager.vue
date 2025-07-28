<template>
  <div class="bonuses-wager">
    <span class="bonuses-wager__label">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.wager') }}:
    </span>

    <template v-if="props.bonusInfo.wagerCasino">
      <atomic-icon id="cherry" class="bonuses-wager__icon" />
      <span class="bonuses-wager__value">x{{ props.bonusInfo.wagerCasino }}</span>
    </template>

    <template v-if="props.bonusInfo.wagerSportsbook">
      <atomic-icon id="sportsbook-football" class="bonuses-wager__icon" />
      <span class="bonuses-wager__value">x{{ props.bonusInfo.wagerSportsbook }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    bonusInfo: Record<string, any>;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
</script>

<style src="~/assets/styles/components/bonuses/wager.scss" lang="scss" />
