import useVuelidate from '@vuelidate/core';

export const useFormValidation = (formRules: any, formData: any) => {
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(formRules, formData);

  const onFocus = (fieldName:string):void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    } if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
  };

  return {
    serverFormErrors,
    v$,
    onFocus,
    setError,
  };
};
