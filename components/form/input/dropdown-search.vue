<template>
  <div
    ref="drop"
    class="dropdown-search"
    :class="classes"
    :tabindex="props.tabIndex ?? 0"
    v-click-outside="onBlur"
  >
    <span
      v-if="props.label"
      class="label"
    >
      {{ props.label }}<span class="required" v-if="props.isRequired">*</span>
    </span>
    
    
    <div class="selected" @click="open">
      <atomic-image
        v-if="valueObject.mask"
        class="mask"
        :src="valueObject.mask" :defaultImage="valueObject.defaultMask"
        :class="{'has-search-query': searchQuery.length > 0}"
      />
      
      <input
        class="dropdown-search__input"
        type="text"
        v-model="searchQuery"
        :placeholder="valueObject.value || props.placeholder"
        @input="onInput"
        @keyup.up="onKeyUp"
        @keydown.down="onKeyDown"
        @keydown.enter="selectByEnter(selectedIndex)"
      >
      <atomic-icon :id="iconType"/>
    </div>
    
    <div
      v-if="props.options.length"
      class="items"
      ref="dropdownItems"
    >
      <template v-if="filteredOptions?.length">
        <div
          class="item"
          v-for="(option, i) in filteredOptions"
          :key="i"
          :class="[
          {'is-selected': option.code === valueObject.code },
          { 'disabled-option': option.disabled },
          {'is-active': selectedIndex === i}
          ]"
          @click="select(option)"
        >
          <atomic-image v-if="option.mask" class="mask" :src="option.mask" :defaultImage="option.defaultMask"/>
          <span class="item-text">{{ option.value }}</span>
          <atomic-icon v-if="option.code === valueObject.code" id="check"/>
        </div>
      </template>
      <div v-else class="search-plug">
        <atomic-image class="search-plug__image" src="/img/search-plug.svg"/>
        <div class="search-plug__title">{{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${props.name}.emptySearchTitle`) || '' }}</div>
      </div>
    </div>
    
    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
    <input type="hidden" :name="props.name" :value="props.value"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    options: any[],
    value: any,
    isRequired?: boolean,
    label?: string,
    placeholder?: string,
    tabIndex?: number,
    name: string,
    size?: 'xs' | 'sm' | 'md' | 'lg',
    isDisabled?: boolean,
    hint?: any,
    isFitContent?: boolean,
    enableSort?: boolean,
    searchBy?: 'name' | 'code',
  }>();
  
  const globalStore = useGlobalStore();
  
  const {
    fieldsSettings,
    defaultLocaleFieldsSettings,
  } = storeToRefs(globalStore);
  
  const { sortByAlphabet, getContent } = useProjectMethods();
  
  const valueObject = ref<any>('');
  const searchQuery = ref<string>('');
  const selectedIndex = ref<number>(0);
  const isOpen = ref<boolean>(false);
  const dropdownItems = ref<HTMLElement>();
  
  let resizeObserver: ResizeObserver|null = null;
  
  if (props.value) {
    valueObject.value = props.options.find((option: any) => option.code === props.value) || {};
  }
  
  const emit = defineEmits(['input', 'focus', 'update:value', 'blur']);
  
  const classes = computed(() => [
    props.size ? `size-${props.size}` : null,
    { 'is-open': isOpen.value },
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-fit-content': props.isFitContent },
  ]);
  
  const filterOptions = (options: any) => {
    const searchKey = props.searchBy || 'name';
    return options.filter((option: any) =>
      option?.[searchKey]?.toLowerCase()
        ?.includes(searchQuery.value.toLowerCase())
    );
  };
  
  const filteredOptions = computed(() => {
    let options = props.options || [];
    const key = props.searchBy || 'name';
    
    if (props.enableSort) {
      options = options.toSorted((prev, next) => sortByAlphabet(prev[key]?.toLowerCase(), next[key]?.toLowerCase()));
    }
    return searchQuery.value ? filterOptions(options) : options;
  });
  
  const iconType = computed(() => {
    return isOpen.value ? 'search' : 'arrow_expand-close';
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
    return filteredOptions.value.findIndex((option: any) => option.code === valueObject.value?.code);
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
  
  watch(() => props.value, (newValue: any) => {
    valueObject.value = filteredOptions.value?.find((option: any) => option.code === newValue) || {};
    selectedIndex.value = getActiveIndex() || 0;
  });
  
  const open = (): void => {
    if (props.isDisabled) return;
    isOpen.value = !isOpen.value;
    emit('focus');
  };
  
  const onBlur = (): void => {
    closeDropdown();
    emit('blur');
  };
  
  onMounted(() => {
    if (props.isFitContent && dropdownItems?.value) {
      const iconWidth = 20;
      const offset = 24;
      let textMaxWidth = 0;
      
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const textItems = entry.target.querySelectorAll('.item-text');
          
          textItems.forEach((textItem) => {
            const textWidth = (textItem as HTMLElement).offsetWidth;
            if (textWidth > textMaxWidth) {
              textMaxWidth = textWidth;
            }
          });
          
          const parent = (entry.target.parentElement?.parentElement as HTMLElement);
          if (parent) {
            parent.style.setProperty('--dropdown-item-min-width', `${textMaxWidth + iconWidth + offset}px`);
          }
        }
      });
      
      resizeObserver.observe(dropdownItems.value);
    }
  });
  
  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });


</script>

<style src="~/assets/styles/components/form/input/dropdown-search.scss" lang="scss"/>

