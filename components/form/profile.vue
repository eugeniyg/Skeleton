<template>
  <form class="form-profile">
    <div class="row">
      <atomic-avatar-profile :is-edit="false"/>

      <form-input-email-verify
        type="email"
        v-model:value="profileFormData.email"
        isDisabled
        :verifyButton="props.verifyButton"
        :hint="emailHint"
        :label="fieldsContent?.email?.label || ''"
        :placeholder="fieldsContent?.email?.placeholder || ''"
        name="email"
      />
    </div>

    <div v-for="n in Math.ceil(rowsFields.length / 2)" :key="`row-${n}`" class="row">
      <component
        :is="fieldsTypeMap[field.name].component || 'form-input-text'"
        @blur="v$[field.name]?.$touch()"
        @focus="focusField(field.name)"
        :isDisabled="!!profile[field.name] && !field.editable"
        v-model:value="profileFormData[field.name]"
        v-for="field in rowsFields.slice(2 * (n - 1), 2 * (n - 1) + 2)"
        :key="field.name"
        :type="fieldsTypeMap[field.name].type || 'text'"
        :label="fieldsContent?.[field.name]?.label || ''"
        :name="field.name"
        :placeholder="fieldsContent?.[field.name]?.placeholder || ''"
        :isRequired="profileFormRules[field.name]?.hasOwnProperty('required')"
        :options="selectOptions[field.name]"
        :hint="setError(field.name)"
      />
    </div>

    <div class="actions">
      <button-base
        type="primary"
        size="md"
        :isDisabled="sendDisabled"
        @click="changePersonalData"
      >
        {{ props.saveButton || '' }}
      </button-base>
      <button-base type="ghost" size="md" @click.prevent="emit('toggle-profile-edit')">
        {{ props.cancelButton || '' }}
      </button-base>
    </div>

    <atomic-divider/>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';

  const props = defineProps<{
    saveButton?: string,
    cancelButton?: string,
    verifyButton?: string,
    verifiedLabel?: string,
    unverifiedLabel?: string,
  }>();

  const hideFields = [
    'password',
    'password_confirmation',
    'receiveSmsPromo',
    'receiveEmailPromo',
  ];

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const { setProfileData } = profileStore;
  const fieldsStore = useFieldsStore();
  const { setFormData } = useCoreMethods();
  const { changeProfileData } = useCoreProfileApi();
  const globalStore = useGlobalStore();

  const { selectOptions, profileFields } = storeToRefs(fieldsStore);
  const { fieldsContent } = storeToRefs(globalStore);

  const fieldsWithValue = profileFields.value.map((field) => ({ ...field, value: profile.value[field.name] }));
  const cleanFields = fieldsWithValue.filter((field) => !hideFields.includes(field.name));
  const rowsFields = cleanFields.filter((field) => field.name !== 'email');

  const emailHint = profile.value.confirmedAt
    ? { variant: 'verified', message: props.verifiedLabel || 'Your email is verified' }
    : { variant: 'unverified', message: props.unverifiedLabel || 'Your email is unverified' };

  const emit = defineEmits(['toggle-profile-edit']);
  const profileFormData = reactive(setFormData(cleanFields));
  const { getFormRules, createValidationRules } = useProjectMethods();
  const profileRules = createValidationRules(cleanFields, true);
  const profileFormRules = getFormRules(profileRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(profileFormRules, profileFormData);
  const focused = ref<boolean>(false);
  const sendDisabled = computed(() => v$.value.$invalid || !focused.value);

  const focusField = (fieldName:string):void => {
    focused.value = true;
    onFocus(fieldName);
  };

  const changePersonalData = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      const submitResult = await changeProfileData(profileFormData);
      setProfileData(submitResult);
      emit('toggle-profile-edit');
    } catch (error) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    }
  };
</script>

<style lang="scss">
.form-profile {
  display: grid;
  grid-gap: rem(16px);

  .row {
    display: flex;
    grid-gap: rem(24px);
    flex-direction: var(--flex-direction, column);

    &:first-child {
      display: flex;
    }

    @include media(l) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      --flex-direction: row;
    }
  }

  .actions {
    display: flex;
    grid-gap: rem(8px);
  }
}
</style>
