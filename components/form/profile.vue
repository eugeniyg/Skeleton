<template>
  <form ref="formRoot" class="form-profile">
    <div class="row">
      <loyalty-avatar size="lg" />

      <form-input-email-verify
        v-if="hasEmailField"
        v-model:value="profileFormData.email"
        type="email"
        :is-disabled="!!profile?.email"
        :verify-button="personalContent?.verifyButton || defaultLocalePersonalContent?.verifyButton"
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
        {{ personalContent?.saveButton || defaultLocalePersonalContent?.saveButton || '' }}
      </button-base>

      <button-base type="ghost" size="md" @click.prevent="emit('toggle-profile-edit')">
        {{ personalContent?.cancelButton || defaultLocalePersonalContent?.cancelButton || '' }}
      </button-base>
    </div>

    <atomic-divider />
  </form>
</template>

<script setup lang="ts">
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import type { IProfilePersonal } from '~/types';
  import { changeProfileData } from '@skeleton/api/profile';
  import { setFormData, createValidationRules, getFormRules } from '@skeleton/helpers/formMethods';

  const fieldsMap: Record<string, any> = fieldsTypeMap;
  const personalContent = ref<Maybe<IProfilePersonal>>(inject('personalContent'));
  const defaultLocalePersonalContent = ref<Maybe<IProfilePersonal>>(inject('defaultLocalePersonalContent'));

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
          personalContent.value?.verifiedLabel || defaultLocalePersonalContent.value?.verifiedLabel || 'Your email is verified',
      }
    : {
        variant: 'unverified',
        message:
          personalContent.value?.unverifiedLabel ||
          defaultLocalePersonalContent.value?.unverifiedLabel ||
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
