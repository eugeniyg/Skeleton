<template>
  <div class="quest-tab">
    <div class="quest-tab__items" v-if="props.items.length">
      <quest-task
        v-if="props.items.length"
        v-for="task in props.items"
        :task="task"
        show-actions
        show-progress-bar
        show-timer
      />
      <button-base size="xs" type="ghost" class="quest-tab__load-more">Load</button-base>
    </div>

    <atomic-empty
      v-else
      title="0 Active quests"
      subTitle="Hey, you didn’t have any active quests"
      variant="quest"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: string[]
}>();
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss"/>