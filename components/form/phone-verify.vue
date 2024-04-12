<template>
  <div class="phone-verify">
    <div class="phone-verify__description">
      {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.description') }}
      <span>+{{ props.registrationData?.phone }}</span>
    </div>

    <form-input-code ref="codeInput" v-model:completeCode="completeCode" :hint="errorHint" />

    <div class="phone-verify__resend">
      <span class="phone-verify__resend-hint">
        {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.receiveHint') }}
      </span>

      <div v-if="timer" class="phone-verify__resend-timer">
        <div class="label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.timerLabel') }}
        </div>

        <div class="time">
          <span>{{ Math.floor(currentTime / 60) }}</span>:<span>{{ String(currentTime % 60).padStart(2, '0') }}</span>
        </div>
      </div>

      <button-base
        type="ghost"
        size="xs"
        v-else
        @click="resendCode"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.resendButton') }}
      </button-base>
    </div>

    <button-base
      class="phone-verify__verify-button"
      tagName="div"
      type="primary"
      size="md"
      :isDisabled="!completeCode"
    >
<!--      <atomic-spinner :is-shown="isLockedAsyncButton"/>-->
      {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.verifyButton') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    registrationData?: Record<string, any>;
  }>();

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const errorHint = ref<{ variant: string, message: string }|undefined>();
  const completeCode = ref<string>('');

  const timer = ref<any>(undefined);
  const currentTime = ref<number>(15);

  const startTimer = ():void => {
    timer.value = setInterval(() => {
      if (currentTime.value === 0) {
        clearInterval(timer.value);
        timer.value = undefined;
        return;
      }
      currentTime.value -= 1;
    }, 1000);
  };

  const resendCode = (): void => {
    currentTime.value = 15;
    startTimer();
  }

  const codeInput = ref();
  onMounted(() => {
    startTimer();
    codeInput.value.focusInput();
  });

  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });
</script>

<style src="~/assets/styles/components/form/phone-verify.scss" lang="scss" />
