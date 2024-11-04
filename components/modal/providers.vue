<template>
  <vue-final-modal
    v-model="modals.providers"
    class="modal-providers"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="modal-providers__container">
      <div class="modal-providers__header">
        <div class="modal-providers__header-top">
          <button-modal-close @close="closeModal('providers')"/>
          <div class="modal-providers__header-title">
            {{ getContent(popupsData, defaultLocalePopupsData, 'providers.title') }}
          </div>
        </div>
        
        <form-input-search
          v-model:value="searchValue"
          :placeholder="getContent(popupsData, defaultLocalePopupsData, 'providers.searchPlaceholder')"
          @input="onSearch"
        />
      
      </div>
      
      <div class="modal-providers__content">
        <template v-if="!isShowEmpty">
          <label
            v-for="provider in providersList"
            :key="provider.id"
            :for="provider.id"
            class="modal-providers__item"
          >
            <atomic-image
              class="modal-providers__item-logo"
              src="/img/uploads/777.png"
            />
            
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
            >
            
            <atomic-icon id="check" class="modal-providers__item-checkbox"/>
          </label>
        </template>
        
        <atomic-empty
          v-else
          :title="getContent(popupsData, defaultLocalePopupsData, 'providers.empty.title')"
          :subTitle="getContent(popupsData, defaultLocalePopupsData, 'providers.empty.description')"
          :image="getContent(popupsData, defaultLocalePopupsData, 'providers.empty.image')"
        />
      </div>
      
      <div class="modal-providers__footer">
        <atomic-divider/>
        <button-base type="ghost" :is-disabled="isShowEmpty" @click.prevent="selectAll">
          {{ getContent(popupsData, defaultLocalePopupsData, 'providers.selectAll') }}
        </button-base>
      </div>
    
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import debounce from 'lodash/debounce';
  import type { IGameProvider, IProvidersRequest } from '@skeleton/core/types';
  
  const props = defineProps<{
    selected: string[];
  }>();
  
  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { getProviderList } = useGamesStore();
  const { getContent } = useProjectMethods();
  
  const searchValue = ref<string>('');
  const searchProviders = ref<IGameProvider[]>([]);
  const isShowEmpty = ref<boolean>(false);
  const inputRef = ref();
  
  const { data: gameProviders } = await useLazyAsyncData(() => getProviderList(), { server: false });
  
  const emit = defineEmits(['select']);
  
  const providersList = computed(() => {
    const providers = (!searchProviders.value.length ? gameProviders.value : searchProviders.value) || [];
    return providers.filter(provider => !!provider.gameEnabledCount);
  });
  
  const change = (providerId: string): void => {
    const newProvidersArr = props.selected.includes(providerId)
      ? props.selected.filter(selectedProviderId => selectedProviderId !== providerId)
      : [...props.selected, providerId];
    
    emit('select', newProvidersArr);
  };
  
  const selectAll = () => {
    const all: string[] = [];
    providersList.value.forEach((provider) => {
      all.push(provider.id);
    });
    emit('select', all);
  };
  
  const {
    alertsData,
    defaultLocaleAlertsData
  } = useGlobalStore();
  
  const requestParams = reactive<IProvidersRequest>({
    name: undefined,
    sortBy: undefined,
    sortOrder: undefined
  });
  
  const { showAlert } = useLayoutStore();
  
  const { getGameProviders } = useCoreGamesApi();
  
  const getProviders = async (): Promise<void> => {
    try {
      const responseProviders = await getGameProviders(requestParams);
      searchProviders.value = responseProviders || [];
      isShowEmpty.value = !responseProviders.length;
    } catch {
      showAlert(alertsData?.global?.somethingWrong || defaultLocaleAlertsData?.global?.somethingWrong);
    }
  };
  
  const onSearch = debounce(async (searchValue: string | undefined): Promise<void> => {
    requestParams.name = searchValue?.length && searchValue?.length >= 1 ? searchValue : undefined;
    await getProviders();
  }, 500, { leading: false });
  
</script>

<style src="~/assets/styles/components/modal/providers.scss" lang="scss"/>

