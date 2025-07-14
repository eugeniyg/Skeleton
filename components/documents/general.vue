<template>
  <div class="documents-general">
    <documents-select-type v-show="step === 'select-type'" :form-data="formData" @next-step="nextStep" />

    <documents-uploads
      v-show="step === 'uploads'"
      :key="documentType"
      :document-type="documentType"
      :form-data="formData"
      :loading-fields="loadingFields"
      @prev-step="step = 'select-type'"
      @remove-file="removeFile"
      @add-files="addFiles"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IDocumentFile } from '@skeleton/api/types';
  import { getDocumentFiles, deleteDocumentFile, uploadDocumentFile } from '@skeleton/api/profile';

  const step = ref<'select-type' | 'uploads'>('select-type');
  const documentType = ref<string | undefined>();

  const nextStep = (type: string) => {
    documentType.value = type;
    step.value = 'uploads';
  };

  interface IFormData extends Record<string, IDocumentFile[]> {
    identity_front: IDocumentFile[];
    identity_back: IDocumentFile[];
    identity_selfie_id: IDocumentFile[];
    address: IDocumentFile[];
    payment: IDocumentFile[];
    payment_back: IDocumentFile[];
    other: IDocumentFile[];
  }

  const formData = reactive<IFormData>({
    identity_front: [],
    identity_back: [],
    identity_selfie_id: [],
    address: [],
    payment: [],
    payment_back: [],
    other: [],
  });

  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { showAlert } = useLayoutStore();
  const loadingFields = ref<string[]>([]);

  const setFormData = (documentFiles: IDocumentFile[]): void => {
    Object.keys(formData).forEach(key => {
      formData[key] = documentFiles.filter(file => file.type === key);
    });
  };

  const removeFile = async ({ name, id, status }: { name: string; id: string; status: number }): Promise<void> => {
    try {
      if (status > 0) {
        await deleteDocumentFile(id);
      }
      formData[name] = formData[name].filter(file => file.id !== id);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
  };

  const addFileError = (field: string, fieldsErrors: any): void => {
    const error = fieldsErrors?.file?.[0];
    const lastElIndex = formData[field].length - 1;
    const lastEl = formData[field][lastElIndex];
    formData[field][lastElIndex] = { ...lastEl, status: -1, error };
  };

  const addFiles = async (filesData: { fieldName: string; fileList: File[] }): Promise<void> => {
    loadingFields.value.push(filesData.fieldName);

    const fileObject = {
      fileName: filesData.fileList[0].name,
      id: `${filesData.fileList[0].size}-${filesData.fileList[0].lastModified}`,
      status: 0,
      type: filesData.fieldName,
      createdAt: `${filesData.fileList[0].lastModified}`,
      rejectReason: null,
    };

    formData[filesData.fieldName].push(fileObject);

    try {
      const uploadedFile = await uploadDocumentFile({ file: filesData.fileList[0], type: filesData.fieldName });
      const lastElIndex = formData[filesData.fieldName].length - 1;
      formData[filesData.fieldName][lastElIndex] = uploadedFile;
    } catch (err: any) {
      if (err?.response?.status === 422) {
        addFileError(filesData.fieldName, err.data?.error?.fields);
      } else if (err?.response?.status === 413) {
        addFileError(filesData.fieldName, { file: ['File size to large!'] });
      } else addFileError(filesData.fieldName, { file: ['File upload error!'] });
    } finally {
      loadingFields.value = loadingFields.value.filter(field => field !== filesData.fieldName);
    }
  };

  onMounted(async () => {
    const documentFiles = await getDocumentFiles();
    setFormData(documentFiles);
  });
</script>
