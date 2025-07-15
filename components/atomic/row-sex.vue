<template>
  <div class="row-sex">{{ valueName }}<atomic-icon :id="iconName" /></div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    value?: 'male' | 'female';
  }>();

  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();
  const valueName = computed(() => {
    switch (props.value) {
      case 'male':
        return getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.gender.maleLabel');
      case 'female':
        return getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.gender.femaleLabel');
      default:
        return '';
    }
  });

  const iconName = computed(() => {
    switch (props.value) {
      case 'male':
        return 'male';
      case 'female':
        return 'female';
      default:
        return '';
    }
  });
</script>

<style src="~/assets/styles/components/atomic/row-sex.scss" lang="scss" />
