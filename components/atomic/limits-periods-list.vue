<template>
  <div class="limits-periods-list" :class="{'is-show-edit': props.isShowEdit}">
    <div
      :key="period.title"
      class="limits-periods-list__column"
      v-for="period in props.periods"
    >
      <h4 class="limits-periods-list__title">
        {{ limitsContent?.periodOptions[period.title] ||  defaultLimitsContent?.periodOptions[period.title] }}
      </h4>

      <div class="limits-periods-list__items">
        <atomic-period-item
          v-for="item in period.items"
          v-bind="item"
          :is-show-edit="isShowEdit"
          :key="item.id + item.updatedAt"
          @edit-limit="emit('open-edit-modal', { ...item, limitId: item.id  })"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PlayerLimitInterface } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    periods: {
      title: string,
      items: PlayerLimitInterface[]
    }[],
    isShowEdit: boolean,
  }>();

  const emit = defineEmits(['open-edit-modal']);

  const limitsStore = useLimitsStore();
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
</script>

<style src="~/assets/styles/components/atomic/limits-periods-list.scss" lang="scss" />
