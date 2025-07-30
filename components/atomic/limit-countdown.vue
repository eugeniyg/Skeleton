<template>
  <span class="limit-countdown">
    {{ formatStatus }}
  </span>
</template>

<script setup lang="ts">
  const props = defineProps<{
    expiredAt: string | undefined;
    status: number | undefined;
  }>();

  const dayjs = useDayjs();
  const limitsStore = useLimitsStore();
  const { getLimits } = limitsStore;
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);

  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  const formatStatus = computed(() => {
    const msg =
      props.status === 1
        ? getContent(limitsContent.value, defaultLimitsContent.value, 'coolingOff.activeStatusLabel')
        : getContent(limitsContent.value, defaultLimitsContent.value, 'coolingOff.pendingStatusLabel');

    const dateValue = dayjs(props.expiredAt).format(DATE_FORMAT);

    return msg ? msg.replace('{date}', dateValue) : '';
  });

  const { isAlmostDone, startTimer } = useTimer();

  const getLimitsTimer = ref<NodeJS.Timeout | null>(null);
  watch(isAlmostDone, newValue => {
    if (newValue) getLimitsTimer.value = setTimeout(getLimits, 60000);
  });

  onMounted(() => {
    if (props.expiredAt) {
      startTimer(props.expiredAt);
    }
  });

  onBeforeUnmount(() => {
    if (getLimitsTimer.value) clearTimeout(getLimitsTimer.value);
  });
</script>

<style src="~/assets/styles/components/atomic/limit-countdown.scss" lang="scss" />
