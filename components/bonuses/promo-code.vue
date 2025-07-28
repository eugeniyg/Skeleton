<template>
  <div class="bonuses-promo-code">
    <h4 class="bonuses-promo-code__title">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'bonusCode.title') }}
    </h4>

    <p class="bonuses-promo-code__description">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'bonusCode.description') }}
    </p>

    <div class="bonuses-promo-code__form">
      <atomic-bonus-code-timer
        v-if="bonusBlocked"
        :timer-text="getContent(bonusesContent, defaultLocaleBonusesContent, 'bonusCode.timerText')"
        :timer-value="timerValue"
        @time-out="openBonus"
      />

      <div class="bonuses-promo-code__form-wrap">
        <atomic-icon id="lottery" />

        <form-input-text
          v-model:value="bonusValue"
          label=""
          :placeholder="
            getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.bonusCode.placeholder') || ''
          "
          name="bonus-code"
          autocomplete="off"
          :is-disabled="bonusBlocked"
        />

        <button-base type="primary" size="md" :is-disabled="bonusBlocked || bonusSending" @click="sendBonus">
          {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'bonusCode.buttonLabel') }}
        </button-base>
      </div>
    </div>

    <div v-if="bonusBlocked" class="bonuses-promo-code__error">
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'bonusCode.tryError') }}
    </div>

    <div class="bonuses-promo-code__img">
      <atomic-image :src="getContent(bonusesContent, defaultLocaleBonusesContent, 'bonusCode.image')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from '~/types';
  import { addBonusCode } from '@skeleton/api/bonuses';

  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const bonusValue = ref<string>('');
  const defaultTimerSeconds = 180;
  const timerValue = ref<number>(defaultTimerSeconds);
  const bonusBlocked = ref<boolean>(false);

  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();

  const checkStorageTimer = (): void => {
    const storageValue = localStorage.getItem('bonusTimer');
    if (!storageValue) return;

    const blockTime = Date.parse(storageValue || '');
    const currentTime = Date.now();
    const diffSeconds = Math.ceil(defaultTimerSeconds - (currentTime - blockTime) / 1000);
    if (diffSeconds < 1) {
      localStorage.removeItem('bonusTimer');
      return;
    }

    timerValue.value = diffSeconds;
    bonusBlocked.value = true;
  };

  const blockBonus = (): void => {
    localStorage.setItem('bonusTimer', new Date().toISOString());
    timerValue.value = defaultTimerSeconds;
    bonusBlocked.value = true;
  };

  const openBonus = (): void => {
    localStorage.removeItem('bonusTimer');
    bonusBlocked.value = false;
  };

  const { showBonusCodeNotification } = useBonusStore();
  const bonusSending = ref<boolean>(false);
  const sendBonus = async (): Promise<void> => {
    if (!bonusValue.value || bonusSending.value || bonusBlocked.value) return;
    bonusSending.value = true;

    try {
      const response = await addBonusCode(bonusValue.value, 1);
      showBonusCodeNotification(response.status);
    } catch (err: any) {
      if (err.response?.status === 400 && err.data?.error?.code === 5) {
        blockBonus();
      } else showBonusCodeNotification(3);
    } finally {
      bonusValue.value = '';
      bonusSending.value = false;
    }
  };

  onMounted(() => {
    checkStorageTimer();
  });
</script>

<style src="~/assets/styles/components/bonuses/promo-code.scss" lang="scss" />
