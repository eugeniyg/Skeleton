<template>
  <div class="security-documents">
    <form-get-file
      type="identity"
      :formData="identityFormData"
      :loadingFields="loadingFields"
      @removeFile="removeFile"
      @addFiles="addFiles"
    />

    <form-get-file
      type="address"
      :formData="addressFormData"
      :loadingFields="loadingFields"
      @removeFile="removeFile"
      @addFiles="addFiles"
    />

    <form-get-file
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
  import { SecurityFileInterface } from '@platform/frontend-core/dist/module';

  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const identityFormData = reactive<{[key:string]:SecurityFileInterface[]}>({
    identity_front: [],
    identity_back: [],
    identity_selfie_id: [],
  });
  const addressFormData = reactive<{[key:string]:SecurityFileInterface[]}>({
    address: [],
  });
  const paymentFormData = reactive<{[key:string]:SecurityFileInterface[]}>({
    payment: [],
  });

  const addFileData = (field: string, file:SecurityFileInterface):void => {
    if (identityFormData.hasOwnProperty(field)) identityFormData[field].push(file);
    else if (addressFormData.hasOwnProperty(field)) addressFormData[field].push(file);
    else if (paymentFormData.hasOwnProperty(field)) paymentFormData[field].push(file);
  };

  const replaceFileData = (field: string, file:SecurityFileInterface):void => {
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

  const { getSecurityFiles, deleteSecurityFile, uploadSecurityFile } = useCoreProfileApi();
  const loadingFields = ref<string[]>([]);
  const { showAlert } = useLayoutStore();

  const removeFile = async ({ fieldName, fileId }:{fieldName: string, fileId:string}):Promise<void> => {
    try {
      await deleteSecurityFile(fileId);
      if (identityFormData.hasOwnProperty(fieldName)) {
        identityFormData[fieldName] = identityFormData[fieldName].filter((file) => file.id !== fileId);
      } else if (addressFormData.hasOwnProperty(fieldName)) {
        addressFormData[fieldName] = addressFormData[fieldName].filter((file) => file.id !== fileId);
      } else if (paymentFormData.hasOwnProperty(fieldName)) {
        paymentFormData[fieldName] = paymentFormData[fieldName].filter((file) => file.id !== fileId);
      }
    } catch {
      showAlert(alertsData.value?.somethingWrong || defaultLocaleAlertsData.value?.somethingWrong);
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
      const uploadedFile = await uploadSecurityFile({ file: filesData.fileList[0], type: filesData.fieldName });
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
    const securityFiles = await getSecurityFiles();

    Object.keys(identityFormData).forEach((key) => {
      identityFormData[key] = securityFiles.filter((file) => file.type === key);
    });
    Object.keys(addressFormData).forEach((key) => {
      addressFormData[key] = securityFiles.filter((file) => file.type === key);
    });
    Object.keys(paymentFormData).forEach((key) => {
      paymentFormData[key] = securityFiles.filter((file) => file.type === key);
    });
  });
</script>

<style lang="scss">
.security-documents {
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
