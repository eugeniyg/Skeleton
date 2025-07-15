<template>
  <div
    ref="drop"
    v-click-outside="onBlur"
    class="dropdown-search"
    :class="classes"
    :tabindex="props.tabIndex ?? 0"
    @inview="setMaxWidth"
  >
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <div class="selected" @click="open">
      <atomic-image
        v-if="valueObject.mask"
        class="mask"
        :src="valueObject.mask"
        :default-image="valueObject.defaultMask"
        :class="{ 'has-search-query': searchQuery.length > 0 }"
      />

      <input
        v-model="searchQuery"
        class="dropdown-search__input"
        type="text"
        :placeholder="valueObject.value || props.placeholder"
        @input="onInput"
        @keyup.up="onKeyUp"
        @keydown.down="onKeyDown"
        @keydown.enter="selectByEnter(selectedIndex)"
      />
      <atomic-icon :id="iconType" />
    </div>

    <div v-if="props.options.length" ref="dropdownItems" class="items">
      <template v-if="filteredOptions?.length">
        <div
          v-for="(option, i) in filteredOptions"
          :key="i"
          class="item"
          :class="[
            { 'is-selected': option.code === valueObject.code },
            { 'disabled-option': option.disabled },
            { 'is-active': selectedIndex === i },
          ]"
          @click="select(option)"
        >
          <atomic-image v-if="option.mask" class="mask" :src="option.mask" :default-image="option.defaultMask" />
          <span ref="itemText" class="item-text">{{ option.value }}</span>
          <atomic-icon v-if="option.code === valueObject.code" id="check" />
        </div>
      </template>
      <div v-else class="search-plug">
        <atomic-image class="search-plug__image" src="/img/search-plug.svg" />
        <div class="search-plug__title">
          {{ emptySearchTitle }}
        </div>
      </div>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
    <input type="hidden" :name="props.name" :value="props.value" />
  </div>
</template>

<script setup lang="ts">
  import { sortByAlphabet } from '@skeleton/helpers/simpleMethods';
  import { initObserver } from '@skeleton/helpers/observer';

  const props = defineProps<{
    options: any[];
    value: any;
    isRequired?: boolean;
    label?: string;
    placeholder?: string;
    tabIndex?: number;
    name: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    hint?: any;
    isFitContent?: boolean;
    enableSort?: boolean;
    searchBy?: 'name' | 'code';
    emptySearchTitle?: string;
  }>();

  const globalStore = useGlobalStore();

  const { fieldsSettings, defaultLocaleFieldsSettings } = storeToRefs(globalStore);

  const valueObject = ref<any>('');
  const searchQuery = ref<string>('');
  const selectedIndex = ref<number>(0);
  const isOpen = ref<boolean>(false);
  const isVisible = ref<boolean>(false);
  const dropdownItems = ref<HTMLElement>();
  const drop = ref<HTMLElement>();
  const itemText = ref([]);
  const textMaxWidth = ref(0);
  const observer = ref();

  if (props.value) {
    valueObject.value = props.options.find((option: any) => option.code === props.value) || {};
  }

  const emit = defineEmits(['input', 'focus', 'update:value', 'blur']);

  const classes = computed(() => [
    props.size ? `size-${props.size}` : null,
    { 'is-open': isOpen.value },
    { 'is-visible': isVisible.value },
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-fit-content': props.isFitContent },
  ]);

  const filterOptions = (options: any) => {
    const searchKey = props.searchBy || 'name';
    return options.filter((option: any) =>
      option?.[searchKey]?.toLowerCase()?.includes(searchQuery.value.toLowerCase())
    );
  };

  const emptySearchTitle = computed(() => {
    return (
      props.emptySearchTitle ||
      getContent(
        fieldsSettings.value,
        defaultLocaleFieldsSettings.value,
        `fieldsControls.${props.name}.emptySearchTitle`
      ) ||
      ''
    );
  });

  const filteredOptions = computed(() => {
    const options = props.options || [];
    const key = props.searchBy || 'name';

    if (props.enableSort) {
      options.sort((prev, next) => sortByAlphabet(prev[key]?.toLowerCase(), next[key]?.toLowerCase()));
    }
    return searchQuery.value ? filterOptions(options) : options;
  });

  const iconType = computed(() => {
    return isOpen.value ? 'search' : 'arrow-expand-close';
  });

  const select = (option: any) => {
    if (option.code !== props.value) {
      emit('update:value', option.code);
      emit('input', option.code);
    }
    isOpen.value = false;
    searchQuery.value = '';
  };

  const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
  };

  const getActiveIndex = () => {
    const key = props.searchBy || 'name';
    return filteredOptions.value.findIndex((option: any) => option?.[key] === valueObject.value?.[key]);
  };

  const resetIndex = () => {
    if (selectedIndex.value > filteredOptions.value?.length - 1) {
      selectedIndex.value = 0;
    }
  };

  const selectByEnter = (index: number) => {
    const selected = filteredOptions.value?.[index];
    if (selected) {
      emit('update:value', selected.code);
      emit('input', selected.code);
      selectedIndex.value = index;
    }
    closeDropdown();
  };

  const onKeyUp = () => {
    if (!isOpen.value) {
      isOpen.value = true;
    } else {
      resetIndex();
      if (selectedIndex.value === 0) {
        selectedIndex.value = filteredOptions.value.length - 1;
      } else if (selectedIndex.value < filteredOptions.value.length) {
        selectedIndex.value--;
      }

      scrollIntoView();
    }
  };

  const onKeyDown = () => {
    if (!isOpen.value) {
      isOpen.value = true;
    } else {
      resetIndex();
      if (selectedIndex.value === filteredOptions.value.length - 1) {
        selectedIndex.value = 0;
      } else if (selectedIndex.value < filteredOptions.value.length) {
        selectedIndex.value++;
      }

      scrollIntoView();
    }
  };

  const onInput = () => {
    if (!isOpen.value) isOpen.value = true;
  };

  const scrollIntoView = () => {
    nextTick(() => {
      const selectedElement = dropdownItems.value?.querySelector('.item.is-active') as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest' });
    });
  };

  watch(
    () => props.value,
    (newValue: any) => {
      valueObject.value = filteredOptions.value?.find((option: any) => option.code === newValue) || {};
      selectedIndex.value = getActiveIndex() || 0;
    }
  );

  const open = (): void => {
    if (props.isDisabled) return;
    if (!isOpen.value) {
      isOpen.value = true;
      emit('focus');
    }
  };

  const onBlur = (): void => {
    if (isOpen.value) {
      closeDropdown();
      emit('blur');
    }
  };

  const setMaxWidth = () => {
    if (props.isFitContent && drop.value && dropdownItems?.value) {
      const iconWidth = 20;
      const offset = 24;

      itemText.value.forEach(textItem => {
        const textWidth = (textItem as HTMLElement).offsetWidth;
        if (textWidth > textMaxWidth.value) {
          textMaxWidth.value = textWidth;
        }
      });

      drop.value?.style.setProperty('--dropdown-item-min-width', `${textMaxWidth.value + iconWidth + offset}px`);
    }
    isVisible.value = true;
  };

  onMounted(() => {
    observer.value = initObserver({
      settings: {
        root: null,
        rootMargin: '0%',
        threshold: 0,
      },
    });
    observer.value.observe(drop.value);
  });

  onBeforeUnmount(() => {
    observer.value?.unobserve(drop.value);
  });
</script>

<style src="~/assets/styles/components/form/input/dropdown-search.scss" lang="scss" />
