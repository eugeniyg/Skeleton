<template>
  <div v-if="benefitsContent" class="group-benefits">
    <atomic-icon :id="benefitsContent.icon"/>
    <h2 class="title">{{ benefitsContent.label }}</h2>

    <div class="group-benefits__list">
      <div
        class="group-benefits__item"
        v-for="(benefit, index) in benefitsContent.items"
        :key="index"
      >
        <img class="icon" :src="benefit.image" alt="" />
        <div class="title" v-html="marked.parse(benefit.title)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { BenefitsContentInterface } from '~/types';

  const { globalComponentsContent } = useGlobalStore();
  const benefitsContent:BenefitsContentInterface|undefined = globalComponentsContent?.benefits;
</script>

<style lang="scss" src="./style.scss"/>
