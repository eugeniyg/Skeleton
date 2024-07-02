<template>
  <div class="quest-tab">
    <div class="quest-tab__items" v-if="props.items.length">
      <quest-task
        v-for="task in props.items"
        :task="task"
      />

      <button-base size="xs" type="ghost" class="quest-tab__load-more">Load</button-base>
    </div>
    <atomic-empty
      v-else
      title="0 Completed quests"
      subTitle="Hey, you didn’t have any completed quests"
      variant="quest"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: string[],
}>();

console.log(props.items);
</script>



<style src="~/assets/styles/components/quest/tab.scss" lang="scss"/>
