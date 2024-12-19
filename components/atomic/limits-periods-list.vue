<template>
  <div class="limits-periods-list" :class="{ 'is-show-edit': props.isShowEdit }">
    <div v-for="period in props.periods" :key="period.title" class="limits-periods-list__column">
      <h4 class="limits-periods-list__title">
        {{
          getContent(
            globalComponentsContent,
            defaultLocaleGlobalComponentsContent,
            `constants.limitPeriods.${period.title}`
          )
        }}
      </h4>

      <div class="limits-periods-list__items">
        <atomic-period-item
          v-for="item in period.items"
          v-bind="item"
          :key="item.id + item.updatedAt"
          :is-show-edit="isShowEdit"
          @edit-limit="openModal('edit-cash-limit', { props: { ...item, limitId: item.id } })"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerLimit } from '@skeleton/core/types';

  const props = defineProps<{
    periods: {
      title: string;
      items: IPlayerLimit[];
    }[];
    isShowEdit: boolean;
  }>();

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { openModal } = useModalStore();
</script>

<style src="~/assets/styles/components/atomic/limits-periods-list.scss" lang="scss" />
