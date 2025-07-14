<template>
  <div class="phone-verify">
    <div class="phone-verify__description">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.description') }}
      <span>+{{ props.phone }}</span>
    </div>

    <form-input-code ref="codeInput" v-model:complete-code="completeCode" :hint="props.errorHint" />

    <div class="phone-verify__resend">
      <span class="phone-verify__resend-hint">
        <template v-if="limitError">
          {{
            getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.limitError')
          }}
        </template>

        <template v-else>
          {{
            getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.receiveHint')
          }}
        </template>
      </span>

      <template v-if="!limitError">
        <div v-if="timer" class="phone-verify__resend-timer">
          <div class="label">
            {{
              getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.timerLabel')
            }}
          </div>

          <div class="time">
            <span>{{ Math.floor(currentTime / 60) }}</span
            >:<span>{{ String(currentTime % 60).padStart(2, '0') }}</span>
          </div>
        </div>

        <button-base v-else type="ghost" size="xs" @click.once="resendCode">
          {{
            getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.resendButton')
          }}
        </button-base>
      </template>
    </div>

    <button-base
      class="phone-verify__verify-button"
      tag-name="div"
      type="primary"
      size="md"
      :is-disabled="!completeCode || props.errorHint || props.loading"
      @click="verifyPhone"
    >
      <atomic-spinner :is-shown="props.loading" />
      {{ props.buttonLabel }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { sendOtp } from '@skeleton/api/auth';

  const props = defineProps<{
    phone: string;
    reason: 'registration' | 'phoneVerification' | 'changingPass';
    errorHint?: { variant: string; message: string };
    loading: boolean;
    buttonLabel: string;
  }>();

  const emit = defineEmits(['verifyPhone', 'removeErrorHint']);
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const completeCode = ref<string>('');

  watch(completeCode, () => {
    if (props.errorHint) emit('removeErrorHint');
  });

  const TIMER_TIME = 60;
  const timer = ref<any>(undefined);
  const currentTime = ref<number>(TIMER_TIME);

  const startTimer = (): void => {
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
      await sendOtp({ phone: props.phone, reason: props.reason });
      currentTime.value = TIMER_TIME;
      startTimer();
    } catch (error: any) {
      if (error.data?.error?.code === 11005) limitError.value = true;
      else throw error;
    }

    resendingCode.value = false;
  };

  const verifyPhone = async (): Promise<void> => {
    if (props.loading) return;
    emit('verifyPhone', completeCode.value);
  };

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
