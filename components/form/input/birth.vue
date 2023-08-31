<template>
  <div class="input-birth">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
      <button-clear-input v-if="!props.isDisabled" @click="clearInput"/>
    </span>

    <form-input-dropdown
      name="birth-day"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.birthdate.placeholderDay') || ''"
      :is-disabled="props.isDisabled"
      v-model:value="selected.day"
      :options="days"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputDays"
      @focus="emit('focus')"
    />

    <form-input-dropdown
      name="birth-month"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.birthdate.placeholderMonth') || ''"
      :is-disabled="props.isDisabled"
      :options="months"
      v-model:value="selected.month"
      :hint="{ ...props.hint, message: '' }"
      @input="onInputMonth"
      @focus="emit('focus')"
    />

    <form-input-dropdown
      name="birth-year"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.birthdate.placeholderYear') || ''"
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

  const {
    fieldsSettings,
    defaultLocaleFieldsSettings,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const selected = reactive<{ year: number, month: number, day: number }>({
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

  const defaultMonths: Record<number, any> = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  }
  const contentMonths = getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'dateMonths');
  const monthsObj = contentMonths || defaultMonths;


  const years = createItems(1920, maxYear.value, false).reverse();
  const months = Object.keys(monthsObj).map((key) => ({
    title: monthsObj[key],
    value: monthsObj[key],
    code: Number(key),
  }));
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

  const onInputYear = (year:number):void => {
    selected.year = year;
    changeInputValue();
  };

  const onInputMonth = (month:string):void => {
    selected.month = Number(month);
    changeInputValue();
  };

  const onInputDays = (day:number):void => {
    selected.day = day;
    changeInputValue();
  };

  const clearInput = ():void => {
    selected.year = 0;
    selected.month = 0;
    selected.day = 0;
    emit('update:value', null);
    emit('blur', null);
    emit('focus');
  };
</script>

<style src="~/assets/styles/components/form/input/birth.scss" lang="scss" />

