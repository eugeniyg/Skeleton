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
          @onClose="selectDate"
        />
      </client-only>

      <atomic-icon class="mask-placeholder" id="calendar"/>

      <atomic-icon class="mask-toggle" id="arrow_expand-close" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import flatPickr from 'vue-flatpickr-component';
  import { German } from 'flatpickr/dist/l10n/de';

  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    settings: {
      type: Object,
      required: false,
    },
  });

  const defaultSettings = {
    altInput: true,
    altFormat: 'd.m.Y',
    dateFormat: 'Y-m-d',
    monthSelectorType: 'static',
    disableMobile: 'true',
    clickOpens: false,
    locale: {},
  };

  const { currentLocale } = useGlobalStore();
  let localeOption:any;
  if (currentLocale?.code === 'de') localeOption = German;

  if (localeOption) defaultSettings.locale = { ...localeOption, rangeSeparator: ' - ' };
  else defaultSettings.locale = { rangeSeparator: ' - ' };

  const date = ref<any>(null);
  const emit = defineEmits(['change']);
  const selectDate = (selectedDates:Date[]):void => {
    let valueArr:string[] = [];
    if (selectedDates.length) {
      valueArr = selectedDates.map((selectedDate, index) => {
        if (index) selectedDate.setHours(23, 59, 59, 999);
        return selectedDate.toISOString();
      });
    }
    emit('change', valueArr);
  };

  const pickrComponent = ref();
  const togglePickr = ():void => {
    pickrComponent.value.fp.toggle();
  };
</script>

<style src="~/assets/styles/components/form/input/date.scss" lang="scss" />

