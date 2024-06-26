<template>
  <div class="quest-hub">
    <div class="quest-hub__header">
      <h2 class="quest-hub__heading">Quest hub</h2>
      
      <button-base
        class="quest-hub__desktop-history-btn"
        type="ghost"
        size="xs"
        @click="showModal('questHub')"
      >
        Quests history
      </button-base>
    </div>
    
    <quest-accumulated-rewards/>
    
    <div
      v-if="questHubCards?.length"
      class="quest-hub__cards"
    >
      <quest-hub-card
        v-for="(card, index) in questHubCards"
        v-bind="card"
        :show-divider="index < questHubCards.length - 1"
      />
    </div>
    
    <button-base
      class="quest-hub__mobile-history-btn"
      type="ghost"
      size="xs"
      @click="showModal('questHub')"
    >
      See history
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const { questHubCards } = useFakeStore()
  const { showModal } = useLayoutStore();

</script>

<style src="~/assets/styles/components/quest/hub.scss" lang="scss"/>
