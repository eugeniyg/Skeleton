<template>
  <div class="limits__card limits__card--self-exclusion">
    <h4 class="limits__card-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'selfExclusion.label') }}
    </h4>

    <div class="limits__card-dropdown">
      <form-input-dropdown
        name="selfExclusionDropdown"
        v-model:value="selectedPeriod"
        :placeholder="getContent(limitsContent, defaultLimitsContent, 'selfExclusion.selectLabel')"
        :options="selfExclusionPeriod"
      />
      <button-base
        type="primary"
        :is-disabled="!selectedPeriod"
        @click="emit('open-confirm-modal', selectedPeriod)"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'setButtonLabel') }}
      </button-base>
    </div>

    <div class="limits__card-info">
      <p v-html="marked.parse(getContent(limitsContent, defaultLimitsContent, 'selfExclusion.hint'))"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';

  const limitsStore = useLimitsStore();
  const { limitsContent, defaultLimitsContent, selfExclusionPeriod } = storeToRefs(limitsStore);
  const { getContent } = useProjectMethods();

  const selectedPeriod = ref<string>('');

  const emit = defineEmits(['open-confirm-modal']);

</script>
