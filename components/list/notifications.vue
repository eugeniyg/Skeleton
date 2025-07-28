<template>
  <div class="notifications">
    <div class="header">
      <div class="total">{{ props.items.length }} notifications</div>

      <button-base v-if="isShowMarkReadBtn" type="ghost" size="xs" :is-disabled="!props.items.length">
        <atomic-icon id="read-all" />Mark all as read
      </button-base>
    </div>
    <atomic-divider />
    <template v-if="props.items.length > 0">
      <div class="items">
        <atomic-msg v-for="(item, index) in filteredItems" :key="index" v-bind="item" />
      </div>
      <template v-if="isShowReadAllBtn">
        <atomic-divider />
        <button-base type="ghost" size="xs" @click="emit('read-all')">
          Read all<atomic-icon id="arrow-next" />
        </button-base>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isShowMarkReadBtn: boolean;
    isShowReadAllBtn?: boolean;
    max: number;
    items: any[]; // should be replaced
  }>();
  const filteredItems = computed(() => (props.max ? props.items.slice(0, props.max) : props.items));
  const emit = defineEmits(['read-all']);
</script>

<style src="~/assets/styles/components/list/notification.scss" lang="scss" />
