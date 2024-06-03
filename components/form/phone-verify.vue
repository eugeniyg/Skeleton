<template>
  <div class="phone-verify">
    <div class="phone-verify__description">
      {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.description') }}
      <span>+{{ props.registrationData?.phone }}</span>
    </div>

    <form-input-code
      ref="codeInput"
      v-model:completeCode="completeCode"
      :hint="errorHint"
    />

    <div class="phone-verify__resend">
      <span class="phone-verify__resend-hint">
        <template v-if="limitError">
          {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.limitError') }}
        </template>

        <template v-else>
          {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.receiveHint') }}
        </template>
      </span>

      <template v-if="!limitError">
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
          @click.once="resendCode"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.resendButton') }}
        </button-base>
      </template>
    </div>

    <button-base
      class="phone-verify__verify-button"
      tagName="div"
      type="primary"
      size="md"
      :isDisabled="!completeCode || errorHint || loading"
      @click="registerUser"
    >
      <atomic-spinner :is-shown="loading"/>
      {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.verifyButton') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    registrationData?: Record<string, any>;
  }>();

  const emit = defineEmits(['registerSuccess', 'validationError']);
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const errorHint = ref<{ variant: string, message: string }|undefined>();
  const completeCode = ref<string>('');

  watch(completeCode, () => {
    if (errorHint.value) errorHint.value = undefined;
  });

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

  const resendingCode = ref<boolean>(false);
  const limitError = ref<boolean>(false);
  const resendCode = async (): Promise<void> => {
    if (resendingCode.value) return;

    resendingCode.value = true;

    try {
      const { sendOtp } = useCoreAuthApi();
      await sendOtp({ phone: props.registrationData?.phone, reason: 'registration' });
      currentTime.value = 15;
      startTimer();
    } catch (error: any) {
      if (error.data?.error?.code === 11005) limitError.value = true;
      else throw error;
    }

    resendingCode.value = false;
  }

  const loading = ref<boolean>(false);
  const registerUser = async(): Promise<void> => {
    try {
      loading.value = true;
      const { phoneRegistration } = useProfileStore();
      await phoneRegistration({ ...props.registrationData, code: completeCode.value });
    } catch (error: any) {
      if (error.response?.status === 422) {
        emit('validationError', error.data.error.fields);
      } else if (error.data?.error?.code === 11003) {
        errorHint.value = {
          variant: 'error',
          message: getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.invalidError')
        };
      } else {
        throw error;
      }
    } finally {
      loading.value = false;
    }
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
