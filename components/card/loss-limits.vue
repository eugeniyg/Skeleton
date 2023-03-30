<template>
  <div class="limits__card">
    <h4 class="limits__card-title">{{ lossLimits.title }}</h4>

    <div v-if="props.isAdded"></div>

    <div class="limits__card-info is-text-center" v-html="lossLimits.info"/>

    <div class="limits__card-actions">
      <button-base type="primary" @click>{{ lossLimits.buttons.primary.title }}</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const {
    profileLimits: {
      lossLimits,
    },
  } = useFakeStore();

  interface PropsInterface {
    isAdded: boolean,
  }

  const props = defineProps<PropsInterface>();

</script>
