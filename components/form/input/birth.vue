<template>
  <div class="input-birth">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
      <button-clear-input v-if="!props.isDisabled" @click="clearInput" />
    </span>

    <form-input-dropdown
      v-model:value="selected.day"
      name="birth-day"
      :placeholder="
        getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.birthdate.placeholderDay') || ''
      "
      :is-disabled="props.isDisabled"
      :options="days"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputDays"
      @focus="emit('focus')"
    />

    <form-input-dropdown
      v-model:value="selected.month"
      name="birth-month"
      :placeholder="
        getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.birthdate.placeholderMonth') || ''
      "
      :is-disabled="props.isDisabled"
      :options="months"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputMonth"
      @focus="emit('focus')"
    />

    <form-input-dropdown
      v-model:value="selected.year"
      name="birth-year"
      :placeholder="
        getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.birthdate.placeholderYear') || ''
      "
      :is-disabled="props.isDisabled"
      :options="years"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputYear"
      @focus="emit('focus')"
    />

    <atomic-hint v-if="hint" v-bind="hint" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label?: string;
    value?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    hint?: { variant: string; message: string };
  }>();

  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings } = globalStore;
  const { currentLocale } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const selected = reactive<{ year: number; month: number; day: number }>({
    year: 0,
    month: 0,
    day: 0,
  });
  const maxYear = computed(() => new Date().getFullYear() - 18);

  const addZero = (val: number): string => (val < 10 ? `0${val}` : String(val));
  const createItems = (min: number = 1920, max: number = maxYear.value, formatTitle: boolean = false): any => {
    const items = [];
    while (min <= max) {
      const item: number = min++;
      items.push({
        title: formatTitle ? addZero(item) : item,
        value: item,
        code: item,
      });
    }
    return items;
  };

  const dayjs = useDayjs();
  dayjs.locale(currentLocale.value?.code);
  const dayjsMonths = dayjs.months();

  const years = createItems(1920, maxYear.value, false).reverse();
  const months = dayjsMonths.map((monthName, index) => ({
    title: monthName,
    value: monthName,
    code: index + 1,
  }));
  const days = createItems(1, 31, true);

  if (props.value) {
    const dateArr = props.value.split(' ')[0].split('-');
    selected.year = Number(dateArr[0]);
    selected.month = Number(dateArr[1]);
    selected.day = Number(dateArr[2]);
  }

  const emit = defineEmits(['update:value', 'blur', 'focus']);
  const changeInputValue = (): void => {
    const { year, month, day } = selected;
    if (year && month && day) {
      const valueString = `${addZero(year)}-${addZero(month)}-${addZero(day)}`;
      emit('update:value', valueString);
      emit('blur', valueString);
    }
  };

  const onInputYear = (year: number): void => {
    selected.year = year;
    changeInputValue();
  };

  const onInputMonth = (month: string): void => {
    selected.month = Number(month);
    changeInputValue();
  };

  const onInputDays = (day: number): void => {
    selected.day = day;
    changeInputValue();
  };

  const clearInput = (): void => {
    selected.year = 0;
    selected.month = 0;
    selected.day = 0;
    emit('update:value', null);
    emit('blur', null);
    emit('focus');
  };
</script>

<style src="~/assets/styles/components/form/input/birth.scss" lang="scss" />
