<template>
  <form ref="formRoot" class="form-profile">
    <div class="row">
      <loyalty-avatar size="lg" />

      <form-input-email-verify
        v-if="hasEmailField"
        v-model:value="profileFormData.email"
        type="email"
        :is-disabled="!!profile?.email"
        :verify-button="infoContent?.verifyButton || defaultLocaleInfoContent?.verifyButton"
        :hint="profile?.email ? emailHint : setError('email')"
        :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.label') || ''"
        :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.placeholder') || ''"
        name="email"
        @blur="v$.email?.$touch()"
        @focus="focusField('email')"
      />
    </div>

    <div v-for="n in Math.ceil(rowsFields.length / 2)" :key="`row-${n}`" class="row">
      <component
        :is="fieldsMap[field.name]?.component || 'form-input-text'"
        v-for="field in rowsFields.slice(2 * (n - 1), 2 * (n - 1) + 2)"
        :key="field.name"
        v-model:value="profileFormData[field.name]"
        :is-disabled="!!profile?.[field.name] && !field.editable"
        :type="fieldsMap[field.name]?.type || 'text'"
        :inputmode="fieldsMap[field.name]?.inputmode"
        :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || ''"
        :name="field.name"
        :placeholder="
          getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.placeholder`) || ''
        "
        :is-required="profileFormRules[field.name]?.hasOwnProperty('required')"
        :options="selectOptions[field.name]"
        :hint="setError(field.name)"
        @blur="v$[field.name]?.$touch()"
        @focus="focusField(field.name)"
      />
    </div>

    <div class="actions">
      <button-base type="primary" size="md" :is-disabled="sendDisabled" @click="changePersonalData">
        {{ infoContent?.saveButton || defaultLocaleInfoContent?.saveButton || '' }}
      </button-base>

      <button-base type="ghost" size="md" @click.prevent="emit('toggle-profile-edit')">
        {{ infoContent?.cancelButton || defaultLocaleInfoContent?.cancelButton || '' }}
      </button-base>
    </div>

    <atomic-divider />
  </form>
</template>

<script setup lang="ts">
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import type { IProfileInfo } from '~/types';
  import { changeProfileData } from '@skeleton/api/profile';
  import { setFormData, createValidationRules, getFormRules } from '@skeleton/helpers/formMethods';

  const fieldsMap: Record<string, any> = fieldsTypeMap;
  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));

  const hideFields = ['password', 'password_confirmation', 'receiveSmsPromo', 'receiveEmailPromo'];

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const { setProfileData } = profileStore;
  const fieldsStore = useFieldsStore();
  const globalStore = useGlobalStore();

  const hasEmailField = computed(() => {
    return profileFields.value.some(field => field.name === 'email');
  });

  const { selectOptions, profileFields } = storeToRefs(fieldsStore);
  const { fieldsSettings, defaultLocaleFieldsSettings } = storeToRefs(globalStore);

  const fieldsWithValue = profileFields.value.map(field => ({ ...field, value: profile.value?.[field.name] }));
  const cleanFields = fieldsWithValue.filter(field => !hideFields.includes(field.name));
  const rowsFields = cleanFields.filter(field => field.name !== 'email');

  const emailHint = profile.value?.confirmedAt
    ? {
        variant: 'verified',
        message:
          infoContent.value?.verifiedLabel || defaultLocaleInfoContent.value?.verifiedLabel || 'Your email is verified',
      }
    : {
        variant: 'unverified',
        message:
          infoContent.value?.unverifiedLabel ||
          defaultLocaleInfoContent.value?.unverifiedLabel ||
          'Your email is unverified',
      };

  const emit = defineEmits(['toggle-profile-edit']);
  const profileFormData = reactive(setFormData(cleanFields));
  const profileRules = createValidationRules(cleanFields, true);
  const profileFormRules = getFormRules(profileRules);
  const { serverFormErrors, v$, onFocus, setError, scrollToValidationError } = useFormValidation(
    profileFormRules,
    profileFormData
  );
  const focused = ref<boolean>(false);
  const sendDisabled = computed(
    () => v$.value.$invalid || Object.keys(serverFormErrors.value)?.length || !focused.value
  );

  const focusField = (fieldName: string): void => {
    focused.value = true;
    onFocus(fieldName);
  };

  const formRoot = ref();
  const changePersonalData = async (): Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) {
      scrollToValidationError(formRoot.value);
      return;
    }

    try {
      const submitResult = await changeProfileData(profileFormData);
      setProfileData(submitResult);
      emit('toggle-profile-edit');
      useEvent('profileUpdated');
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
        await nextTick();
        scrollToValidationError(formRoot.value);
      } else throw error;
    }
  };
</script>

<style src="~/assets/styles/components/form/profile.scss" lang="scss" />
