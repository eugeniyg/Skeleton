<template>
  <form class="form-profile">
    <div class="row">
      <atomic-avatar-profile :is-edit="false"/>

      <form-input-text
        type="email"
        v-model:value="profileFormData.email"
        isDisabled
        :hint="emailHint"
        :label="fieldsContent.email?.label || ''"
        :placeholder="fieldsContent.email?.placeholder || ''"
        name="email"
      />
    </div>

    <div v-for="n in Math.ceil(rowsFields.length / 2)" :key="`row-${n}`" class="row">
      <component
        :is="fieldsTypeMap[field.name].component || 'form-input-text'"
        @blur="v$[field.name]?.$touch()"
        @focus="onFocus(field.name)"
        :isDisabled="profile[field.name] && !field.editable"
        v-model:value="profileFormData[field.name]"
        v-for="field in rowsFields.slice(2 * (n - 1), 2 * (n - 1) + 2)"
        :key="field.name"
        :type="fieldsTypeMap[field.name].type || 'text'"
        :label="fieldsContent[field.name]?.label || ''"
        :name="field.name"
        :placeholder="fieldsContent[field.name]?.placeholder || ''"
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
        Save changes
      </button-base>
      <button-base type="ghost" size="md" @click.prevent="emit('toggle-profile-edit')">Cancel</button-base>
    </div>

    <atomic-divider/>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';
  import { useGlobalMethods, useProfileApi } from '~/CORE';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';

  const hideFields = [
    'password',
    'password_confirmation',
    'receiveSmsPromo',
    'receiveEmailPromo',
  ];

  const { profile, profileFields, setProfileData } = useProfileStore();
  const fieldsStore = useFieldsStore();
  const { setFormData } = useGlobalMethods();
  const { changeProfileData } = useProfileApi();

  const globalStore = useGlobalStore();
  const { fieldsContent } = storeToRefs(globalStore);

  const fieldsWithValue = profileFields.map((field) => ({ ...field, value: profile[field.name] }));
  const cleanFields = fieldsWithValue.filter((field) => !hideFields.includes(field.name));
  const rowsFields = cleanFields.filter((field) => field.name !== 'email');

  const { selectOptions } = storeToRefs(fieldsStore);
  const emailHint = { variant: 'verified', message: 'Your email is verified' };

  const emit = defineEmits(['toggle-profile-edit']);
  const profileFormData = reactive(setFormData(cleanFields));
  const { getFormRules } = useProjectMethods();
  const profileFormRules = getFormRules(cleanFields);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(profileFormRules, profileFormData);
  const focused = ref<boolean>(false);
  const sendDisabled = computed(() => v$.value.$invalid || !focused.value);

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    } if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
  };

  const onFocus = (fieldName:string):void => {
    focused.value = true;
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
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

<style lang="scss" src="./style.scss"/>
