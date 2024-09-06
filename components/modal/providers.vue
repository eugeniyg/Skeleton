<template>
  <vue-final-modal
    v-model="modals.providers"
    class="modal-providers"
    
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
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
          @input="searchInput"
        />
      
      </div>
      
      <div class="modal-providers__content">
        <label
          v-for="provider in providersList"
          :key="provider.id"
          class="modal-providers__item"
          :for="provider.id"
        >
          <atomic-image
            class="modal-providers__item-logo"
            :default-image="getContent(popupsData, defaultLocalePopupsData, 'providers.defaultLogoPlaceholder')"
            :src="`/img/providers/${provider.identity}.svg`"
          />
          
          <span class="modal-providers__item-name">{{ provider.name }}</span>
          
          <span class="modal-providers__item-count">{{ provider.gameEnabledCount }}</span>
          
          <input
            :id="provider.id"
            type="checkbox"
            name="providers"
            :value="provider.id"
            :checked="props.selected.includes(provider.id)"
            class="modal-providers__item-input"
            :class="{ checked: props.selected.includes(provider.id) }"
            @change="change(provider.id)"
          >
          
          <atomic-icon id="check" class="modal-providers__item-checkbox"/>
        </label>
      </div>
      
      <div class="modal-providers__footer">
        <atomic-divider/>
        <button-base type="ghost" v-if="selectedCount">
          {{ getContent(popupsData, defaultLocalePopupsData, 'providers.selectAll') }}({{ selectedCount }})
        </button-base>
        <button-base type="ghost" v-else>{{ getContent(popupsData, defaultLocalePopupsData, 'providers.clearAll') }}
        </button-base>
      </div>
    
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import type { IGameProvider, IProvidersRequest } from '@skeleton/core/types';
  import type { IGamesPage } from '~/types';
  
  const props = defineProps<{
    selected: string[];
  }>();
  
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { showAlert } = useLayoutStore();
  
  const globalStore = useGlobalStore();
  const {
    layoutData,
    defaultLocaleLayoutData,
    alertsData,
    defaultLocaleAlertsData
  } = storeToRefs(globalStore);
  
  const providersList = ref<IGameProvider[]>([]);
  
  const searchValue = ref<string>('');
  const selectedCount = ref<number>(245);
  const selectedProviders = ref<string[]>([]);
  
  const requestParams = reactive<IProvidersRequest>({
    name: undefined,
    sortBy: undefined,
    sortOrder: undefined
  });
  
  const filterProviders = (providers: IGameProvider[]): void => {
    providersList.value = providers.filter(provider => !!provider.gameEnabledCount);
    //staticProviderInfo.value = providers.find(provider => provider.identity === staticProviderIdentity.value && !!provider.gameEnabledCount);
  };
  const { getGameProviders } = useCoreGamesApi();
  const loadingProviders = ref<boolean>(true);
  const getProviders = async (): Promise<void> => {
    try {
      const responseProviders = await getGameProviders(requestParams);
      filterProviders(responseProviders);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
  };
  
  const searchInput = () => {
    console.log(searchValue.value);
  };
  
  const selectedAll = ref<boolean>(false);
  
  const emit = defineEmits(['select']);
  
  const checkSelectedAll = (newProvidersArr: string[]): void => {
    selectedAll.value = newProvidersArr.length === providersList.value.length;
  };
  
  const change = (providerId: string): void => {
    if (selectedAll.value) {
      const newProvidersArr = providersList.value.reduce((finalArr: string[], currentProvider) => {
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
  
  const tryAgain = async (): Promise<void> => {
    closeModal('providers');
  };
  
  onMounted(async () => {
    await getProviders();
    loadingProviders.value = false;
  });
</script>

<style src="~/assets/styles/components/modal/providers.scss" lang="scss"/>
<!--<style src="~/assets/styles/components/modal/error.scss" lang="scss" />-->


