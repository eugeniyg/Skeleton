<template>
  <div class="input-date">
    <span class="label">{{ props.label }}</span>
    <div class="row">
      <client-only>
        <vue-flat-pickr
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
  import vueFlatPickr from 'vue-flatpickr-component';
  import flatpickr from 'flatpickr';

  const { currentLocale } = useGlobalStore();
  if (currentLocale.code !== 'en') {
    let localeOptions;

    if (currentLocale.name === 'Russian') {
      localeOptions = await import('flatpickr/dist/l10n/ru');
    } else if (currentLocale.name === 'Ukrainian') {
      localeOptions = await import('flatpickr/dist/l10n/uk');
    }
    flatpickr.localize(localeOptions[currentLocale.name]);
  }

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
    locale: {
      rangeSeparator: ' - ',
    },
  };

  const date = ref<any>(undefined);
  const emit = defineEmits(['change']);
  const selectDate = (selectedDates):void => {
    let valueArr = [];
    if (selectedDates.length) {
      valueArr = selectedDates.map((selectedDate) => {
        const currentDate = new Date(selectedDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
      });
    }
    emit('change', valueArr);
  };
</script>

<style lang="scss" src="./style.scss"/>
