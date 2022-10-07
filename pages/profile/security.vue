<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">{{ securityContent?.title }}</h1>
    </div>

    <!--
    <div class="get-file-grid">
      <form-get-file class="identity" v-bind="securityVerificationIdentity"/>
      <form-get-file class="address" v-bind="securityVerificationAddress"/>
      <form-get-file class="payment" v-bind="securityVerificationPayment"/>
    </div>
    -->

    <hr/>

    <form class="form form-change">
      <div v-for="field in Object.keys(changeFormData)" :key="field" :class="`row row-${field}`">
        <form-input-password
          v-model:value="changeFormData[field]"
          type="password"
          :name="field"
          :label="fieldsContent?.[field]?.label || ''"
          :placeholder="fieldsContent?.[field]?.placeholder || ''"
          :is-required="true"
          :hint="setError(field)"
          @blur="v$[field]?.$touch()"
          @focus="onFocus(field)"
          @input="inputNewPassword(field)"
        />
      </div>

      <button-base
        type="primary"
        size="md"
        tagName="div"
        @click="onSubmit"
        :isDisabled="v$.$invalid || isLockedAsyncButton"
      >
        {{ securityContent?.saveButton }}
      </button-base>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileSecurityInterface } from '~/types';

  // const { securityVerificationIdentity, securityVerificationAddress, securityVerificationPayment } = useFakeStore();

  const globalStore = useGlobalStore();
  const { fieldsContent, alertsData, currentLocale } = storeToRefs(globalStore);

  const securityContentRequest = await useAsyncData('securityContent', () => queryContent(`profile/${currentLocale.value.code}`).only(['security']).findOne());
  const securityContent:ProfileSecurityInterface|undefined = securityContentRequest.data.value?.security;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(securityContent?.seo);

  const changeFormData = reactive({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules } = useProjectMethods();
  const changeRules = createValidationRules(Object.keys(changeFormData).map((field) => ({ name: field })));
  const changeFormRules = getFormRules(changeRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(changeFormRules, changeFormData);

  const inputNewPassword = (fieldName):void => {
    if (fieldName === 'newPassword' && v$.value.repeatNewPassword.$dirty) {
      const oldValue = changeFormData.repeatNewPassword;
      changeFormData.repeatNewPassword = '';
      changeFormData.repeatNewPassword = oldValue;
    }
  };

  const clearForm = ():void => {
    Object.keys(changeFormData).forEach((field) => { changeFormData[field] = ''; });
    v$.value.$reset();
  };

  const { showAlert } = useLayoutStore();
  const isLockedAsyncButton = ref<boolean>(false);
  const { changeProfilePassword } = useCoreProfileApi();
  const onSubmit = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await changeProfilePassword(changeFormData);
      showAlert(alertsData.value?.passwordChanged);
      clearForm();
    } catch (error) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss">
.security {
  .form-change {
    grid-template-areas:
      "old"
      "new"
      "reenter"
      "save";

    @include media(xs) {
      grid-template-areas:
      "old ."
      "new reenter"
      "save save";
    }
  }

  .row-currentPassword {
    grid-area: old;
  }

  .row-newPassword {
    grid-area: new;
  }

  .row-repeatNewPassword {
    grid-area: reenter;
  }

  .btn-primary {
    grid-area: save;
  }
}

.get-file-grid {
  display: grid;
  width: 100%;
  grid-template-areas:
    "identity identity"
    "address address"
    "payment payment";
  grid-template-columns: repeat(2, 1fr);
  grid-gap: rem(16px);

  @include media(sm) {
    grid-template-areas:
      "identity identity"
      "address payment";
  }

  @include media(md) {
    grid-gap: rem(24px);
  }

  .identity {
    grid-area: identity;
  }

  .address {
    grid-area: address;
  }

  .payment {
    grid-area: payment;
  }
}
</style>
