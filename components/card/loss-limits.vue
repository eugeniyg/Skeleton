<template>
  <div
    class="limits__card"
    :class="makeFullWidth(props.limits)"
  >
    <h4 class="limits__card-title">{{ lossLimits.title }}</h4>

    <div class="limits__card-info is-text-center" v-html="lossLimits.info"/>

    <div class="limits__card-actions">
      <button-base type="primary" @click.stop>
        {{ lossLimits.buttons.primary.title }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LimitInterface } from '~/types/limits';

  interface PropsInterface {
    limits?: LimitInterface[],
  }

  const props = defineProps<PropsInterface>();

  const {
    profileLimits: {
      lossLimits,
    },
  } = useFakeStore();

  const emit = defineEmits(['']);

  const makeFullWidth = (columns: any) => ({ 'is-full-width': Object.keys(columns).length > 1 });

</script>
