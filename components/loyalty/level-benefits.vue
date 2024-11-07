<template>
  <div class="level-benefits">
    <div
      v-for="(benefit, index) in props.levelBenefits"
      :key="index"
      class="level-benefits__item"
      :class="{'is-checked': benefit.checked}"
    >
      <div class="level-benefits__checkbox">
        <atomic-icon :id="benefit.checked ? 'check' : 'close'"/>
      </div>

      <div class="level-benefits__label" v-html="replaceContent(benefit.label, '*')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    levelBenefits: {
      label: string;
      checked: boolean;
    }[];
  }>();

  const { replaceContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/loyalty/level-benefits.scss" lang="scss" />