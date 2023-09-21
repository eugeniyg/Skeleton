<template>
  <div>
    <div class="contact">
      <atomic-image
        v-if="contactContent?.image || defaultLocaleContactContent?.image"
        :src="contactContent?.image || defaultLocaleContactContent?.image"
        width="348"
        height="301"
        alt=""
      />

      <div class="header">
        <div class="heading">{{ contactContent?.title || defaultLocaleContactContent?.title }}</div>
        <p class="info">{{ contactContent?.description || defaultLocaleContactContent?.description }}</p>
      </div>

      <div class="form">
        <form-input-text
          v-model:value="contactFormData.email"
          type="email"
          name="email"
          :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.label') || ''"
          :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.placeholder') || ''"
          :hint="setError('email')"
          @blur="v$.email?.$touch()"
        />

        <form-input-textarea
          v-model:value="contactFormData.message"
          name="message"
          :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.message.label') || ''"
          :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.message.placeholder') || ''"
          :hint="setError('message')"
          @blur="v$.message?.$touch()"
        />

        <button-base
          type="primary"
          size="lg"
          :isDisabled="v$.$invalid || isLockedAsyncButton"
          @click="submitContactForm"
        >
          {{ contactContent?.buttonLabel || defaultLocaleContactContent?.buttonLabel }} <atomic-icon id="arrow_next"/>
        </button-base>
      </div>
    </div>

    <atomic-seo-text v-if="contactContent?.seo?.text" v-bind="contactContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IContactsPage } from '~/types';

  const layoutStore = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    setPageSeo,
    getContent,
    getLocalesContentData
  } = useProjectMethods();

  const {
    fieldsSettings,
    defaultLocaleFieldsSettings,
    alertsData,
    defaultLocaleAlertsData,
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleContactPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'contacts').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleContactPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'contacts').findOne()),
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const contactContent: Maybe<IContactsPage> = currentLocaleData;
  const defaultLocaleContactContent: Maybe<IContactsPage> = defaultLocaleData;
  setPageSeo(contactContent?.seo);

  const contactFormData = reactive({
    email: '',
    message: '',
  });

  const contactUsRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
    message: [{ rule: 'required' }],
  };

  const isLockedAsyncButton = ref<boolean>(false);
  const { getFormRules } = useProjectMethods();
  const contactUsFormRules = getFormRules(contactUsRules);
  const { serverFormErrors, v$, setError } = useFormValidation(contactUsFormRules, contactFormData);

  const { sendContactMessage } = useCoreGlobalApi();
  const submitContactForm = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await sendContactMessage(contactFormData);
      layoutStore.showAlert(alertsData.value?.global?.sentMessage || defaultLocaleAlertsData.value?.global?.sentMessage);
      contactFormData.email = '';
      contactFormData.message = '';
      v$.value.$reset();
    } catch (err:any) {
      if (err.response?.status === 422) {
        serverFormErrors.value = err.data?.error?.fields;
      } else throw err;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style src="~/assets/styles/pages/contact.scss" lang="scss" />

