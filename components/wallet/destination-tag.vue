<template>
  <div class="wallet-destination-tag">
    <form-input-copy
      name="destinationTag"
      :label="getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.destinationTag.label')"
      :value="props.value"
      :copy-tooltip="getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.copiedLabel')"
    />

    <wallet-warning :content="warningContent" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    value?: string;
  }>();

  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const warningContent = computed(() => ({
    description: getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.destinationTag.warning'),
  }));
</script>
