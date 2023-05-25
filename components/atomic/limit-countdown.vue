<template>
  <span class="limit-countdown">
    {{ formatStatus(status, dayjs(props.expiredAt).format(DATE_FORMAT)) }}
  </span>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';

  const props = defineProps<{
    expiredAt: string|undefined,
    status: number|undefined,
  }>();

  const limitsStore = useLimitsStore();
  const { getContent } = useProjectMethods();
  const { getLimits } = limitsStore;
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);

  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  const formatStatus = (status: number, date:string) => {
    const msg = status === 1
      ? getContent(limitsContent.value, defaultLimitsContent.value, 'coolingOff.activeStatusLabel')
      : getContent(limitsContent.value, defaultLimitsContent.value, 'coolingOff.pendingStatusLabel');
    return msg.replace('{date}', date);
  };

  const state = reactive<{
    isAlmostDone: boolean,
    diffInSeconds: number,
  }>({
    isAlmostDone: false,
    diffInSeconds: 0,
  });

  const countdown = () => {
    const tick = async () => {
      if (state.diffInSeconds <= 0) {
        state.isAlmostDone = true;

        setTimeout(getLimits, 60000);
      } else {
        state.diffInSeconds -= 1;
        setTimeout(tick, 1000);
      }
    };

    tick();
  };

  onMounted(() => {
    if (props.expiredAt) {
      const start = Date.now();
      const end = new Date(props.expiredAt).getTime();

      state.diffInSeconds = Math.ceil((end - start) / 1000);

      countdown();
    }
  });
</script>

<style lang="scss">
.limit-countdown {
  @include font($body-0);
  color: var(--white);
}
</style>
