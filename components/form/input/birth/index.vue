<template>
  <div class="input-birth">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-dropdown-base
      name="birth-day"
      placeholder="Day"
      :is-disabled="props.isDisabled"
      v-model:value="selected.day"
      :options="days"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputDays"
      @focus="emit('focus')"
    />

    <form-dropdown-base
      name="birth-month"
      placeholder="Month"
      :is-disabled="props.isDisabled"
      :options="months"
      v-model:value="selected.month"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputMonth"
      @focus="emit('focus')"
    />

    <form-dropdown-base
      name="birth-year"
      placeholder="Year"
      :is-disabled="props.isDisabled"
      :options="years"
      v-model:value="selected.year"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputYear"
      @focus="emit('focus')"
    />

    <atomic-hint v-if="hint" v-bind="hint" />
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

  const selected = reactive({
    year: 0,
    month: 0,
    day: 0,
  });
  const maxYear = computed(() => new Date().getFullYear() - 18);

  const addZero = (val: number):string => (val < 10 ? `0${val}` : String(val));
  const createItems = (min:number = 1920, max:number = maxYear.value, formatTitle:boolean = false):any => {
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

  const years = createItems(1920, maxYear.value, false).reverse();
  const months = createItems(1, 12, true);
  const days = createItems(1, 31, true);

  if (props.value) {
    const dateArr = props.value.split(' ')[0].split('-');
    selected.year = Number(dateArr[0]);
    selected.month = Number(dateArr[1]);
    selected.day = Number(dateArr[2]);
  }

  const emit = defineEmits(['update:value', 'blur', 'focus']);
  const changeInputValue = ():void => {
    const { year, month, day } = selected;
    if (year && month && day) {
      emit('update:value', `${year}-${month}-${day}`);
      emit('blur', `${year}-${month}-${day}`);
    }
  };

  const onInputYear = (year):void => {
    selected.year = year;
    changeInputValue();
  };

  const onInputMonth = (month):void => {
    selected.month = month;
    changeInputValue();
  };

  const onInputDays = (day):void => {
    selected.day = day;
    changeInputValue();
  };
</script>

<style lang="scss" src="./style.scss"/>
