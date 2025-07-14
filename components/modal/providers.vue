<template>
  <vue-final-modal
    class="modal-providers"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="modal-providers__container">
      <div class="modal-providers__header">
        <div class="modal-providers__header-top">
          <button-modal-close @close="closeModal('providers')" />
          <div class="modal-providers__header-title">
            {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
          </div>
        </div>

        <form-input-search
          v-model:value="searchValue"
          :placeholder="getContent(props.currentLocaleData, props.defaultLocaleData, 'searchPlaceholder')"
          @input="onSearch"
        />
      </div>

      <div class="modal-providers__content">
        <template v-if="!isShowEmpty">
          <label v-for="provider in providersList" :key="provider.id" :for="provider.id" class="modal-providers__item">
            <div class="modal-providers__item-logo">
              <atomic-provider-logo :providerData="provider" />
            </div>

            <span class="modal-providers__item-name">{{ provider.name }}</span>
            <span class="modal-providers__item-count">{{ provider.gameEnabledCount }}</span>

            <input
              :id="provider.id"
              ref="inputRef"
              class="modal-providers__item-input"
              name="providers"
              type="checkbox"
              :class="{ checked: props.selected.includes(provider.id) }"
              :value="provider.id"
              :checked="props.selected.includes(provider.id)"
              @change="change(provider.id)"
            />

            <atomic-icon id="check" class="modal-providers__item-checkbox" />
          </label>
        </template>

        <atomic-empty
          v-else
          :title="getContent(props.currentLocaleData, props.defaultLocaleData, 'empty.title')"
          :sub-title="getContent(props.currentLocaleData, props.defaultLocaleData, 'empty.description')"
          :image="getContent(props.currentLocaleData, props.defaultLocaleData, 'empty.image')"
        />
      </div>

      <div class="modal-providers__footer">
        <atomic-divider />
        <button-base type="ghost" :is-disabled="isShowEmpty" @click.prevent="selectAll">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'selectAll') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import debounce from 'lodash/debounce';
  import type { IGameProvider, IProvidersRequest } from '@skeleton/api/types';
  import type { IModalsContent } from '~/types';
  import { getGameProviders } from '@skeleton/api/games';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['providers']>;
    defaultLocaleData: Maybe<IModalsContent['providers']>;
    selected: string[];
  }>();

  const { closeModal } = useModalStore();
  const { gameProviders } = useGamesStore();

  const searchValue = ref<string>('');
  const searchProviders = ref<IGameProvider[]>([]);
  const isShowEmpty = ref<boolean>(false);
  const inputRef = ref();

  const emit = defineEmits(['select']);
  const providersList = computed(() => {
    const providers = (!searchProviders.value.length ? [...gameProviders] : searchProviders.value) || [];
    return providers.filter(provider => !!provider.gameEnabledCount);
  });

  const change = (providerId: string): void => {
    const newProvidersArr = props.selected.includes(providerId)
      ? props.selected.filter(selectedProviderId => selectedProviderId !== providerId)
      : [...props.selected, providerId];

    emit('select', newProvidersArr);
  };

  const selectAll = () => {
    const all: string[] = providersList.value.map(provider => provider.id);
    emit('select', all);
  };

  const { alertsData, defaultLocaleAlertsData } = useGlobalStore();

  const requestParams = reactive<IProvidersRequest>({
    name: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  });

  const { showAlert } = useLayoutStore();

  const getProviders = async (): Promise<void> => {
    try {
      const responseProviders = await getGameProviders(requestParams);
      searchProviders.value = responseProviders || [];
      isShowEmpty.value = !responseProviders.length;
    } catch {
      showAlert(alertsData?.global?.somethingWrong || defaultLocaleAlertsData?.global?.somethingWrong);
    }
  };

  const onSearch = debounce(
    async (searchValue: string | undefined): Promise<void> => {
      requestParams.name = searchValue?.length && searchValue?.length >= 1 ? searchValue : undefined;
      await getProviders();
    },
    500,
    { leading: false }
  );
</script>

<style src="~/assets/styles/components/modal/providers.scss" lang="scss" />
