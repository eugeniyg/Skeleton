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
      valueArr = selectedDates.map((selectedDate) => selectedDate.toISOString());
    }
    emit('change', valueArr);
  };
</script>

<style lang="scss">
.input-date {
  @extend %input-label;
  position: relative;
  width: 100%;

  .row {
    position: relative;
  }

  .form-control {
    background: none;
    background-color: var(--bg, var(--gray-800));
    padding: var(--input-padding-y, #{rem(7px)}) rem(44px);
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    border-radius: 8px;
    @include font($heading-2);
    transition: border-color .2s ease-in-out;
    width: 100%;

    &::placeholder {
      color: var(--gray-400);
      @include font($body-1);
    }

    &:focus {
      --border-color: var(--gray-300);
    }

    &.active {
      ~ .mask-toggle {
        --icon-transform: rotate(180deg);
      }
    }
  }

  .mask-placeholder {
    position: absolute;
    left: rem(16px);
    top: 0;
    bottom: 0;
    margin: auto;
    --color: var(--white);

  }

  .mask-toggle {
    position: absolute;
    right: rem(16px);
    top: 0;
    bottom: 0;
    margin: auto;
    color: var(--icon-color, var(--gray-400));
    transform: var(--icon-transform, rotate(0));
    transition: transform .2s ease-in-out;
  }

  .label {
    color: var(--white);
  }
}

@import "~/scss/flatpickr-calendar.scss";
</style>
