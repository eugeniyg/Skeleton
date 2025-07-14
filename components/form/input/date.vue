<template>
  <div class="input-date">
    <span class="label">{{ props.label }}</span>
    <div class="row" @click="togglePickr">
      <client-only>
        <flat-pickr
          ref="pickrComponent"
          v-model="date"
          :config="{ ...defaultSettings, ...props.settings }"
          placeholder="-- / -- / ----"
          @on-close="selectDate"
        />
      </client-only>

      <atomic-icon id="calendar" class="mask-placeholder" />

      <atomic-icon id="arrow_expand-close" class="mask-toggle" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import flatPickr from 'vue-flatpickr-component';
  import pickrLocales from 'flatpickr/dist/l10n';
  import type { key } from 'flatpickr/dist/types/locale';

  const props = defineProps<{
    label: string;
    settings?: Record<string, any>;
  }>();

  const defaultSettings = {
    altInput: true,
    altFormat: 'd.m.Y',
    dateFormat: 'Y-m-d',
    monthSelectorType: 'static',
    disableMobile: 'true',
    clickOpens: false,
    locale: {},
  };

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const mainLocale = currentLocale.value?.code?.split('-')?.[0] || '';
  const localeOption: any = pickrLocales[mainLocale as key];

  if (localeOption) defaultSettings.locale = { ...localeOption, rangeSeparator: ' - ' };
  else defaultSettings.locale = { rangeSeparator: ' - ' };

  const date = ref<any>(null);
  const emit = defineEmits(['change']);
  const selectDate = (selectedDates: Date[]): void => {
    let valueArr: string[] = [];
    if (selectedDates.length) {
      valueArr = selectedDates.map((selectedDate, index) => {
        if (index) selectedDate.setHours(23, 59, 59, 999);
        return selectedDate.toISOString();
      });
    }
    emit('change', valueArr);
  };

  const pickrComponent = ref();
  const togglePickr = (): void => {
    pickrComponent.value.fp.toggle();
  };
</script>

<style src="~/assets/styles/components/form/input/date.scss" lang="scss" />
