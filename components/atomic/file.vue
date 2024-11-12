<template>
  <div class="file">
    <div class="file__progress" data-tooltip-parent>
      <div class="file__name">{{ props.fileName }}</div>

      <atomic-tooltip
        v-if="fileStatus"
        :text="statusText[fileStatus]"
        :icon="statusIcon"
        :class="statusIconClasses"
        :message-custom-class="`status-${fileStatus}`"
        size="small"
      />

      <button v-if="props.status" class="file__rm-btn" @click.prevent="emit('remove')">
        <atomic-icon id="close" />
      </button>

      <atomic-progress v-show="(!fileStatus || isShowProgress) && !props.error" @hide-progress="hideProgress" />

      <transition name="fade" mode="out-in">
        <div v-if="props.error || props.rejectReason" class="file__error">
          {{ props.error || props.rejectReason }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id?: string;
    fileName?: string;
    status?: number;
    type?: string;
    createdAt?: string;
    error?: string;
    rejectReason: null | string;
  }>();

  const globalStore = useGlobalStore();

  const statusIcons: { [index: string]: string } = {
    approve: 'done',
    pending: 'clock',
    canceled: 'warning',
  };

  const statusText: Record<string, string> = {
    approve: 'Approved',
    pending: 'Pending',
    canceled: 'Rejected',
  };

  const emit = defineEmits(['remove']);

  const fileStatus = computed(() => {
    if (!props.status) return undefined;

    const findStatus = globalStore.documentStatuses.find(status => status.id === props.status);
    return findStatus ? findStatus.name.toLowerCase() : undefined;
  });
  const statusIcon = computed(() => (fileStatus.value ? statusIcons[fileStatus.value] : undefined));

  const isShowProgress = ref(false);

  const statusIconClasses = computed(() => ['file__status-icon', `status-${fileStatus.value}`]);

  const hideProgress = () => {
    isShowProgress.value = false;
  };
</script>

<style src="~/assets/styles/components/atomic/file.scss" lang="scss" />
