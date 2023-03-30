<template>
  <div>
    <div class="contact">
      <img
        v-if="contactContent?.image || defaultLocaleContactContent?.image"
        class="img"
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
          :label="getContent(fieldsContent, defaultLocaleFieldsContent, 'email.label') || ''"
          :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'email.placeholder') || ''"
          :hint="setError('email')"
          @blur="v$.email?.$touch()"
        />

        <form-input-textarea
          v-model:value="contactFormData.message"
          name="message"
          :label="getContent(fieldsContent, defaultLocaleFieldsContent, 'message.label') || ''"
          :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'message.placeholder') || ''"
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
  import { ContactPageInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    setPageSeo,
    getContent,
    findLocalesContentData,
  } = useProjectMethods();

  const {
    fieldsContent,
    defaultLocaleFieldsContent,
    alertsData,
    defaultLocaleAlertsData,
    contentLocalesArray,
  } = storeToRefs(globalStore);

  const contactContentRequest = await useAsyncData('contactContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'contactPage']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(contactContentRequest.data.value);
  const contactContent: Maybe<ContactPageInterface> = currentLocaleData?.contactPage;
  const defaultLocaleContactContent: Maybe<ContactPageInterface> = defaultLocaleData?.contactPage;
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

  const { sendContactMessage } = useCoreNotificationApi();
  const submitContactForm = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await sendContactMessage(contactFormData);
      layoutStore.showAlert(alertsData.value?.sentMessage || defaultLocaleAlertsData.value?.sentMessage);
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

<style lang="scss">
.contact {
  @include text-page-max;
  display: grid;
  grid-template-areas: var(--areas, "img" "header" "form");

  @include media(l) {
    --areas: "header img" "form img";
    grid-template-columns: 1fr auto;
    grid-column-gap: rem(56px);
  }

  .img {
    display: block;
    width: var(--width, #{rem(200px)});
    height: var(--height, auto);
    margin-bottom: var(--margin-bottom, #{rem(40px)});
    grid-area: img;
    justify-self: center;

    @include media(l) {
      --width: #{rem(348px)};
      align-self: center;
      --margin-bottom: 0;
    }
  }

  .header {
    display: grid;
    grid-gap: rem(8px);
    grid-area: header;
  }

  .info {
    @include font($body-2-paragraph);
    color: var(--gray-400);
    margin: 0 0 rem(40px);
  }

  .heading {
    @include font($heading-7);
    color: var(--white);
  }

  .form {
    grid-area: form;
    grid-gap: rem(16px);
  }

  .btn-primary {
    --width: 100%;
    @include media(l) {
      --width: fit-content;
      @include upd-font($heading-2);
      --padding: #{rem(9px)} #{rem(24px)};
    }
  }
}
</style>
