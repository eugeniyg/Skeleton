<template>
  <div class="verification">
    <div class="verification__header">
      <h1 class="heading">{{ verificationContent?.title || defaultLocaleVerificationContent?.title }}</h1>
    </div>
    
    <profile-documents/>
    
    <form-input-dropdown
      v-bind="documentDropdownProps"
      v-model:value="selectedDocument"
      :options="mappedDocumentDropdownOptions"
      class="verification__dropdown"
      name="verification-dropdown"
      @input="onInputDocument"
    />
    
    <profile-verification-documents displayType="identity" />
    
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileVerification } from '~/types';
  
  const { setPageSeo, getLocalesContentData } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  
  const documentDropdownProps = {
    label: "Document",
    placeholder: "Select type of document",
  };
  
  const selectedDocument = ref<string>('');
  
  const documentDropdownOptions = [
    {
      id: 'address',
      name: 'address'
    },
    {
      id: 'payments',
      name: 'payments'
    },
    {
      id: 'other',
      name: 'other'
    },
  ]
  
  const mappedDocumentDropdownOptions = computed(() => {
    return documentDropdownOptions.map((option: { id: string|null, name: string }) => ({
      value: option.name,
      code: option.id,
    }));
  });
  
  const onInputDocument = () => {
    alert(selectedDocument);
  }
  
  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProfileVerificationContent', () => queryContent(currentLocale.value?.code as string, 'profile', 'verification').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProfileVerificationContent', () => queryContent(defaultLocale.value?.code as string, 'profile', 'verification').findOne())
  ]);
  
  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const verificationContent: Maybe<IProfileVerification> = currentLocaleData;
  const defaultLocaleVerificationContent: Maybe<IProfileVerification> = defaultLocaleData;
  
  setPageSeo(verificationContent?.seo);
  
  provide('documentsContent', verificationContent?.documents);
  provide('defaultLocaleDocumentsContent', defaultLocaleVerificationContent?.documents);
</script>

<style src="~/assets/styles/components/profile/verification.scss" lang="scss"/>
