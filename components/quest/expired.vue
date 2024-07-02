<template>
  <div class="quest-tab">
    <div v-if="props.items.length" class="quest-tab__items">
      <quest-task
        v-if="props.items.length"
        v-for="task in props.items"
        :task="task"
        bw-enabled
      />

      <button-base size="xs" type="ghost" class="quest-tab__load-more">Load</button-base>
    </div>
    <atomic-empty
      v-else
      title="0 Expired quests"
      subTitle="Hey, you didn’t have any expired quests"
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