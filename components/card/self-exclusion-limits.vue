<template>
  <div class="limits__card" :class="{ 'is-full-width': isFullWidth }">
    <h4 class="limits__card-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'selfExclusion.label') }}
    </h4>

    <div class="limits__card-dropdown">
      <form-input-dropdown
        v-model:value="selectedPeriod"
        name="selfExclusionDropdown"
        :placeholder="getContent(limitsContent, defaultLimitsContent, 'selfExclusion.selectLabel')"
        :options="selfExclusionPeriod"
      />
      <button-base
        type="primary"
        :is-disabled="!selectedPeriod"
        @click="openModal('self-exclusion-limit', { props: { period: selectedPeriod } })"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'setButtonLabel') }}
      </button-base>
    </div>

    <div class="limits__card-info">
      <p v-html="hintContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const limitsStore = useLimitsStore();
  const {
    limitsContent,
    defaultLimitsContent,
    selfExclusionPeriod,
    depositPeriods,
    betPeriods,
    lossPeriods,
    isAdvancedModeEnabled,
  } = storeToRefs(limitsStore);
  const { openModal } = useModalStore();

  const selectedPeriod = ref<string>('');
  const hintContent = computed(() => {
    const contentText = getContent(limitsContent.value, defaultLimitsContent.value, 'selfExclusion.hint');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parse(contentText) as string, { FORBID_TAGS: ['style'] });
  });

  const isFullWidth = computed(
    () =>
      (isAdvancedModeEnabled.value &&
        depositPeriods.value.length < 2 &&
        lossPeriods.value.length < 2 &&
        betPeriods.value.length < 2) ||
      (isAdvancedModeEnabled.value &&
        depositPeriods.value.length > 1 &&
        lossPeriods.value.length > 1 &&
        betPeriods.value.length < 2) ||
      (isAdvancedModeEnabled.value &&
        depositPeriods.value.length > 2 &&
        lossPeriods.value.length > 2 &&
        betPeriods.value.length < 1) ||
      (isAdvancedModeEnabled.value &&
        depositPeriods.value.length > 2 &&
        lossPeriods.value.length > 1 &&
        betPeriods.value.length < 2) ||
      (isAdvancedModeEnabled.value &&
        depositPeriods.value.length < 1 &&
        lossPeriods.value.length > 1 &&
        betPeriods.value.length < 2)
  );
</script>
