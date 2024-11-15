export function useTimer() {
  const isAlmostDone = ref<boolean>(false);
  const diffInSeconds = ref<number>(0);
  const days = ref<string | number>(0);
  const hours = ref<string | number>(0);
  const minutes = ref<string | number>(0);
  const seconds = ref<string | number>(0);
  const timer = ref<NodeJS.Timeout | null>(null);

  const countdown = () => {
    const tick = () => {
      if (diffInSeconds.value <= 0) {
        isAlmostDone.value = true;
      } else {
        diffInSeconds.value -= 1;
        days.value = Math.floor(diffInSeconds.value / (24 * 3600));
        hours.value = Math.floor(diffInSeconds.value / 3600) % 24;
        minutes.value = Math.floor((diffInSeconds.value % 3600) / 60);
        seconds.value = diffInSeconds.value % 60;

        timer.value = setTimeout(tick, 1000);
      }
    };

    tick();
  };

  const startTimer = (expiredDate: string) => {
    const start = Date.now();
    const end = new Date(expiredDate).getTime();
    diffInSeconds.value = Math.ceil((end - start) / 1000);
    countdown();
  };

  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });

  return {
    isAlmostDone,
    days,
    hours,
    minutes,
    seconds,
    startTimer,
  };
}
