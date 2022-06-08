<template>
  <div class="input-birth">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-dropdown-base
      name="birth-day"
      placeholder="Day"
      :is-disabled="isDaysDisabled || props.isDisabled"
      v-model:value="selected.day"
      :options="days"
      :hint="errorDay"
      @input="onInputDays"
      @click.prevent="handleDayClick"
    />

    <form-dropdown-base
      name="birth-month"
      placeholder="Month"
      :is-disabled="props.isDisabled"
      :options="months"
      v-model:value="selected.month"
      :hint="errorMonth"
      @input="onInputMonth"
    />

    <form-dropdown-base
      name="birth-year"
      placeholder="Year"
      :is-disabled="props.isDisabled"
      :options="years"
      v-model:value="selected.year"
      :hint="errorYear"
      @input="onInputYear"
    />

    <atomic-hint v-if="hintProps" v-bind="hintProps" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    label: {
      type: String,
      default: 'label',
    },
    value: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const days = ref<string[]>([]);
  const selected = reactive({
    year: 0,
    month: 0,
    day: 0,
  });
  const isDaysDisabled = ref<boolean>(true);
  const hintProps = ref<{ variant: string, message: string }|undefined>();
  const errorDay = ref<{ variant: string }|undefined>();
  const errorMonth = ref<{ variant: string }|undefined>();
  const errorYear = ref<{ variant: string }|undefined>();

  const maxYear = computed(() => new Date().getFullYear() - 18);

  const addZero = (val: number):string => (val < 10 ? `0${val}` : String(val));
  const createItems = (min:number = 1980, max:number = maxYear.value, formatTitle:boolean = false):any => {
    const items = [];
    while (min <= max) {
      const item:number = min++;
      items.push({
        title: formatTitle ? addZero(item) : item,
        value: item,
        code: item,
      });
    }
    return items;
  };

  const daysInMonth = (month:number, year:number):number => new Date(year, month, 0).getDate();

  const years = createItems(1980, maxYear.value, false);
  const months = createItems(1, 12, true);

  const showError = (message:string = ''):void => {
    hintProps.value = {
      variant: 'error',
      message,
    };
  };

  watch(() => props.hint, (newValue:any) => {
    if (newValue) {
      showError(newValue.message);
      errorDay.value = { variant: 'error' };
      errorMonth.value = { variant: 'error' };
      errorYear.value = { variant: 'error' };
    }
  });

  const createDays = ():void => {
    const { year, month } = selected;

    if (year && month) {
      const daysCount = daysInMonth(year, month);
      days.value = createItems(1, daysCount, true);
      isDaysDisabled.value = false;
      errorDay.value = { variant: 'error' };
      showError('Please select day');
    }
  };

  const clearAllErrors = ():void => {
    errorDay.value = undefined;
    errorMonth.value = undefined;
    errorYear.value = undefined;
    hintProps.value = undefined;
  };

  const handleErrors = ():void => {
    const { year, month, day } = selected;

    clearAllErrors();

    if (year && !month) {
      errorMonth.value = { variant: 'error' };
      showError('Please select month');
    }

    if (!year && month) {
      errorYear.value = { variant: 'error' };
      showError('Please select year');
    }

    if (year && month && !day) {
      errorDay.value = { variant: 'error' };
      showError('Please select day');
    }

    if (year && month && day) {
      clearAllErrors();
    }
  };

  if (props.value) {
    const dateArr = props.value.split(' ')[0].split('-');
    selected.year = Number(dateArr[0]);
    selected.month = Number(dateArr[1]);
    createDays();
    selected.day = Number(dateArr[2]);
    handleErrors();
  }

  const handleDayClick = ():void => {
    const { year, month, day } = selected;

    if (!day && !month && !year) {
      errorYear.value = { variant: 'error' };
      showError('Please select year');
    }
  };

  const emit = defineEmits(['update:value', 'blur']);
  const changeInputValue = ():void => {
    const { year, month, day } = selected;
    if (year && month && day) {
      emit('update:value', `${year}-${month}-${day}`);
      emit('blur', `${year}-${month}-${day}`);
    }
  };

  const onInputYear = (year):void => {
    selected.year = year;
    createDays();
    handleErrors();
    changeInputValue();
  };

  const onInputMonth = (month):void => {
    selected.month = month;
    createDays();
    handleErrors();
    changeInputValue();
  };

  const onInputDays = (day):void => {
    selected.day = day;
    errorDay.value = undefined;
    hintProps.value = undefined;
    changeInputValue();
  };
</script>

<style lang="scss" src="./style.scss"/>
