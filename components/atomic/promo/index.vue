<template>
  <div class="promo">
    <div class="header">
      <div class="title">{{ registrationContent?.promo?.title }}</div>
      <span class="sub-title">{{ registrationContent?.promo?.secondTitle }}</span>
      <span class="sub-title">{{ registrationContent?.promo?.additionalTitle }}</span>
    </div>

    <div v-if="registrationContent?.promo?.advantages?.length" class="items">
      <div v-for="(advantage, index) in registrationContent.promo.advantages" :key="index" class="item">
        <atomic-icon :id="advantage.icon"/>{{ advantage.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RegistrationInterface } from '~/types';

  const { popupsData } = useGlobalStore();
  const registrationContent: RegistrationInterface|undefined = popupsData?.registration;
</script>

<style lang="scss" src="./style.scss"/>
