<template>
  <div class="external-id" :class="{ 'is-active': tooltipVisible }" @click="copyExternalId">
    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="btn-copy__tooltip">{{ messageAfterCopyText }}</div>
    </transition>
    <div class="external-id__label">
      {{ labelText }}
      <span class="external-id__dots">:</span>
    </div>
    <div class="external-id__value">{{ profile?.externalId }}</div>
    <atomic-icon id="copy" class="external-id__icon" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import copy from 'copy-to-clipboard';
  
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const labelText = computed(() =>
    getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.externalId.label')
  );
  const messageAfterCopyText = computed(() =>
    getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.externalId.copyMsg')
  );

  const showTooltip = (): void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const copyExternalId = () => {
    copy(profile.value?.externalId || '');
    showTooltip();
  };

  defineExpose({
    copyExternalId,
  });
</script>

<style src="~/assets/styles/components/atomic/external-id.scss" lang="scss" />
