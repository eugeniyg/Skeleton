<template>
  <div class="input-providers">
    <button
      class="input-providers__toggle"
      @click.stop="toggleOpen"
      :class="{'is-open': isOpen}"
    >
      <span class="input-providers__title">
        {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'providersLabel') }}
      </span>

      <span class="input-providers__count" :class="{'is-visible': selectedCount}">
        {{ selectedCount }}
      </span>

      <atomic-icon id="arrow_expand-open"/>
    </button>

    <div v-click-outside="closePopup" class="input-providers__content">
      <div class="input-providers__list">
        <div
          class="input-providers__item"
          @click="selectAll"
          :class="{'is-checked': selectedAll}"
        >
          <span class="input-providers__item-label">
            {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'allProvidersOption') }}
          </span>

          <span class="input-providers__game-count">{{ allProviderGames }}</span>

          <atomic-icon class="input-providers__checkbox" id="check"/>
        </div>

        <div
          v-for="provider in gameProviders"
          :key="provider.id"
          class="input-providers__item"
        >
          <label class="input-providers__label">
            <atomic-image class="input-providers__logo" src="/img/provider-empty-placeholder.svg" />

            <span class="input-providers__item-label">{{ provider.name }}</span>

            <span class="input-providers__game-count">{{ provider.gameEnabledCount }}</span>

            <input
              type="checkbox"
              name="providers"
              :checked="props.selected.includes(provider.id)"
              class="input-providers__input"
              :class="{ checked: props.selected.includes(provider.id) }"
              @change="change(provider.id)"
            >

            <atomic-icon class="input-providers__checkbox" id="check"/>
          </label>
        </div>

        <div class="input-providers__clear">
          <button-base
            type="ghost"
            size="xs"
            @click.prevent="clear"
            :is-disabled="!selectedCount"
          >
            {{ getContent(props.currentLocaleContent, props.defaultLocaleContent, 'clearProviders') }}
          </button-base>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {IGamesPage} from "~/types";

  const { gameProviders } = useGamesStore();
  const { getContent } = useProjectMethods();

  const props = defineProps<{
    currentLocaleContent: Maybe<IGamesPage>;
    defaultLocaleContent: Maybe<IGamesPage>;
    selected: string[];
  }>();

  const allProviderGames = gameProviders.reduce((gamesCount, currentProvider) => {
    return gamesCount + currentProvider.gameEnabledCount;
  }, 0)

  const selectedAll = ref<boolean>(false);
  const isOpen = ref<boolean>(false);

  const selectedCount = computed(() => {
    if (selectedAll.value) return gameProviders.length;
    return props.selected.length;
  });

  const emit = defineEmits(['select']);

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };

  const closePopup = (): void => {
    isOpen.value = false
  }

  const checkSelectedAll = (newProvidersArr: string[]): void => {
    selectedAll.value = newProvidersArr.length === gameProviders.length;
  }

  const change = (providerId: string):void => {
    if (selectedAll.value) {
      const newProvidersArr = gameProviders.reduce((finalArr: string[], currentProvider) => {
        return providerId === currentProvider.id ? finalArr : [...finalArr, currentProvider.id];
      }, []);

      selectedAll.value = false;
      emit('select', newProvidersArr);
      return;
    }

    const newProvidersArr = props.selected.includes(providerId)
      ? props.selected.filter(selectedProviderId => selectedProviderId !== providerId)
      : [...props.selected, providerId];

    checkSelectedAll(newProvidersArr);

    if (selectedAll.value) emit('select', []);
    else emit('select', newProvidersArr);
  };

  const selectAll = () => {
    selectedAll.value = !selectedAll.value;

    if (props.selected.length) emit('select', []);
  };

  const clear = () => {
    selectedAll.value = false;

    if (props.selected.length) emit('select', []);
  };
</script>

<style src="~/assets/styles/components/form/input/providers.scss" lang="scss" />

