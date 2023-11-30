<template>
  <div class="verification__documents">
    <form-get-file
      v-if="props.displayType === 'identity'"
      type="identity"
      :formData="identityFormData"
      :loadingFields="loadingFields"
      @removeFile="removeFile"
      @addFiles="addFiles"
    />

    <form-get-file
      v-if="props.displayType === 'address'"
      type="address"
      :formData="addressFormData"
      :loadingFields="loadingFields"
      @removeFile="removeFile"
      @addFiles="addFiles"
    />

    <form-get-file
      v-if="props.displayType === 'payment'"
      type="payment"
      :formData="paymentFormData"
      :loadingFields="loadingFields"
      @removeFile="removeFile"
      @addFiles="addFiles"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IVerificationFile } from '@skeleton/core/types';
  
  const props = defineProps<{
    displayType: 'identity' | 'address' | 'payment'
  }>();

  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const identityFormData = reactive<{[key:string]:IVerificationFile[]}>({
    identity_front: [],
    identity_back: [],
    identity_selfie_id: [],
  });
  const addressFormData = reactive<{[key:string]:IVerificationFile[]}>({
    address: [],
  });
  const paymentFormData = reactive<{[key:string]:IVerificationFile[]}>({
    payment: [],
  });
  
  const addFileData = (field: string, file:IVerificationFile):void => {
    if (identityFormData.hasOwnProperty(field)) identityFormData[field].push(file);
    else if (addressFormData.hasOwnProperty(field)) addressFormData[field].push(file);
    else if (paymentFormData.hasOwnProperty(field)) paymentFormData[field].push(file);
  };

  const replaceFileData = (field: string, file:IVerificationFile):void => {
    if (identityFormData.hasOwnProperty(field)) {
      const lastElIndex = identityFormData[field].length - 1;
      identityFormData[field][lastElIndex] = file;
    } else if (addressFormData.hasOwnProperty(field)) {
      const lastElIndex = addressFormData[field].length - 1;
      addressFormData[field][lastElIndex] = file;
    } else if (paymentFormData.hasOwnProperty(field)) {
      const lastElIndex = paymentFormData[field].length - 1;
      paymentFormData[field][lastElIndex] = file;
    }
  };

  const addFileError = (field: string, fieldsErrors: any):void => {
    const error = fieldsErrors[field]?.[0];
    if (identityFormData.hasOwnProperty(field)) {
      const lastElIndex = identityFormData[field].length - 1;
      const lastEl = identityFormData[field][lastElIndex];
      identityFormData[field][lastElIndex] = { ...lastEl, error };
    } else if (addressFormData.hasOwnProperty(field)) {
      const lastElIndex = addressFormData[field].length - 1;
      const lastEl = addressFormData[field][lastElIndex];
      addressFormData[field][lastElIndex] = { ...lastEl, error };
    } else if (paymentFormData.hasOwnProperty(field)) {
      const lastElIndex = paymentFormData[field].length - 1;
      const lastEl = paymentFormData[field][lastElIndex];
      paymentFormData[field][lastElIndex] = { ...lastEl, error };
    }
  };

  const { getVerificationFiles, deleteVerificationFile, uploadVerificationFile } = useCoreProfileApi();
  const loadingFields = ref<string[]>([]);
  const { showAlert } = useLayoutStore();

  const removeFile = async ({ fieldName, fileId }:{fieldName: string, fileId:string}):Promise<void> => {
    try {
      await deleteVerificationFile(fileId);
      if (identityFormData.hasOwnProperty(fieldName)) {
        identityFormData[fieldName] = identityFormData[fieldName].filter((file) => file.id !== fileId);
      } else if (addressFormData.hasOwnProperty(fieldName)) {
        addressFormData[fieldName] = addressFormData[fieldName].filter((file) => file.id !== fileId);
      } else if (paymentFormData.hasOwnProperty(fieldName)) {
        paymentFormData[fieldName] = paymentFormData[fieldName].filter((file) => file.id !== fileId);
      }
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
  };

  const addFiles = async (filesData: { fieldName: string, fileList: File[] }):Promise<void> => {
    loadingFields.value.push(filesData.fieldName);

    const fileObject = {
      fileName: filesData.fileList[0].name,
      id: `${filesData.fileList[0].size}-${filesData.fileList[0].lastModified}`,
      status: 0,
      type: filesData.fieldName,
      createdAt: `${filesData.fileList[0].lastModified}`,
      rejectReason: null,
    };

    addFileData(filesData.fieldName, fileObject);

    try {
      const uploadedFile = await uploadVerificationFile({ file: filesData.fileList[0], type: filesData.fieldName });
      replaceFileData(filesData.fieldName, uploadedFile);
    } catch (err:any) {
      if (err?.response?.status === 422) {
        addFileError(filesData.fieldName, err.data?.error?.fields);
      } else if (err?.response?.status === 413) {
        addFileError(filesData.fieldName, { [filesData.fieldName]: ['File size to large!'] });
      } else addFileError(filesData.fieldName, { [filesData.fieldName]: ['File upload error!'] });
    } finally {
      loadingFields.value = loadingFields.value.filter((field) => field !== filesData.fieldName);
    }
  };

  onMounted(async () => {
    const verificationFiles = await getVerificationFiles();

    Object.keys(identityFormData).forEach((key) => {
      identityFormData[key] = verificationFiles.filter((file) => file.type === key);
    });
    Object.keys(addressFormData).forEach((key) => {
      addressFormData[key] = verificationFiles.filter((file) => file.type === key);
    });
    Object.keys(paymentFormData).forEach((key) => {
      paymentFormData[key] = verificationFiles.filter((file) => file.type === key);
    });
  });
</script>

