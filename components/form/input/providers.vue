<template>
  <div ref="input" class="input-providers">
    <button
      class="input-providers__toggle"
      @click.prevent="toggleOpen"
      :class="{'is-open': isOpen}"
    >
      <span class="input-providers__title">Providers</span>
      <span class="input-providers__count" :class="{'is-visible': count}">{{ count }}</span>
      <atomic-icon id="arrow_expand-open"/>
    </button>

    <div class="input-providers__content" ref="content">
      <div class="input-providers__list">
        <div
          class="input-providers__item"
          @click.prevent="selectAll"
          :class="{'is-checked': selectedAll}"
        >
          <span class="input-providers__title">All providers</span>
          <atomic-icon class="input-providers__checkbox" id="check"/>
        </div>
        <div v-for="provider in gameProviders" :key="provider.id" class="input-providers__item">
          <label class="input-providers__label">
            <img class="input-providers__logo" src="/img/provider-empty-placeholder.svg" alt="">
            <span class="input-providers__title">{{ provider.name }}</span>
            <input
              type="checkbox"
              name="providers"
              v-model="inputValues[provider.id]"
              class="input-providers__input"
              @change="change"
            >
            <atomic-icon class="input-providers__checkbox" id="check"/>
          </label>
        </div>
        <div class="input-providers__clear">
          <button-base
            type="ghost"
            size="xs"
            @click.prevent="clear"
            :is-disabled="!count"
          >Clear all
          </button-base>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  const { gameProviders } = useGamesStore();

  const props = defineProps<{
    isSelectedAll?: boolean,
    value: string[]
  }>();

  const selectedAll = ref(props.isSelectedAll);
  const isOpen = ref<boolean>(false);
  const inputValues = ref<{[key:string]:boolean|undefined}>({});
  const selected = ref<string[]>([]);
  const input = ref(null);
  const content = ref<HTMLElement>();

  const emit = defineEmits(['update:value']);

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };

  const inputUnfocus = (e:any) => {
    if (!content.value?.contains(e.target) && !e.target.closest('.input-providers__toggle')) {
      isOpen.value = false;
    }
  };

  const change = ():void => {
    selected.value = Object.keys(inputValues.value).filter((key) => inputValues.value[key]);
    emit('update:value', selected.value);
    if (selected.value.length < gameProviders.length) {
      selectedAll.value = false;
    }
  };

  const selectAll = () => {
    selectedAll.value = !selectedAll.value;
    Object.values(gameProviders).forEach((provider) => {
      inputValues.value[provider.id] = selectedAll.value;
    });
    change();
  };

  const clear = () => {
    selectedAll.value = true;
    selectAll();
  };

  const count = computed(() => selected.value.length);

  onMounted(() => {
    document.addEventListener('mouseup', inputUnfocus);
  });

  onUnmounted(() => {
    document.removeEventListener('mouseup', inputUnfocus);
  });
</script>

<style src="~/assets/styles/components/form/input/providers.scss" lang="scss" />

