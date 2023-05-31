<template>
  <div class="file">
    <div class="file__progress">
      <div class="file__name">{{ props.fileName }}</div>

      <atomic-icon v-if="fileStatus" :class="statusIconClasses" :id="statusIcon"/>

      <button v-if="fileStatus" class="file__rm-btn" @click.prevent="emit('remove')">
        <atomic-icon id="close"/>
      </button>

      <atomic-progress
        @hide-progress="hideProgress"
        v-show="(!fileStatus || isShowProgress) && !props.error"
      />

      <transition name="fade" mode="out-in">
        <div class="file__error" v-if="props.error || props.rejectReason">
          {{ props.error || props.rejectReason}}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id?: string,
    fileName?: string,
    status?: number,
    type?: string,
    createdAt?: string,
    error?: string,
    rejectReason: null|string
  }>();

  const globalStore = useGlobalStore();

  const statusIcons:{[index: string]: string} = {
    approve: 'done',
    pending: 'eye-visibility',
    canceled: 'warning',
  };

  const emit = defineEmits(['remove']);

  const fileStatus = computed(() => {
    if (!props.status) return undefined;

    const findStatus = globalStore.documentStatuses.find((status) => status.id === props.status);
    return findStatus ? findStatus.name.toLowerCase() : undefined;
  });
  const statusIcon = computed(() => (fileStatus.value ? statusIcons[fileStatus.value] : undefined));

  const isShowProgress = ref(false);

  const statusIconClasses = computed(() => [
    'file__status-icon',
    `status-${fileStatus.value}`,
  ]);

  const hideProgress = () => {
    isShowProgress.value = false;
  };

</script>

<style src="~/assets/styles/components/atomic/file.scss" lang="scss" />
