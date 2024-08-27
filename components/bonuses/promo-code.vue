<template>
  <div class="bonuses-promo-code">
    <h4 class="bonuses-promo-code__title">{{ props.content?.title }}</h4>
    <p class="bonuses-promo-code__description">{{ props.content?.description }}</p>
    
    <atomic-bonus-code-timer
      v-if="bonusBlocked"
      :timerText="props.content?.timerText"
      :timerValue="timerValue"
      @timeOut="openBonus"
    />
    
    <div class="bonuses-promo-code__form">
      <div class="bonuses-promo-code__form-wrap">
        <atomic-icon id="lottery"/>
        <form-input-text
          v-model:value="bonusValue"
          label=""
          :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.bonusCode.placeholder') || ''"
          name="bonus-code"
          autocomplete="off"
          :isDisabled="bonusBlocked"
        />
        <button-base
          type="primary"
          size="md"
          @click="sendBonus"
          
        >
<!--          :isDisabled="!bonusValue || bonusBlocked"-->
          {{ props.content?.buttonLabel }}
        </button-base>
      </div>
    </div>
    
    <div v-if="showErrorMessage" class="bonuses-promo-code__error">
      {{ props.content?.tryError }}
    </div>
    
    <div class="bonuses-promo-code__img">
      <atomic-image src="/img/uploads/bonus-info-img.png"/>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from '~/types';
  
  const props = defineProps<{
    content?: IProfileBonuses['bonusCode']
  }>();
  
  const bonusValue = ref<string>('');
  const defaultTimerSeconds = 180;
  const timerValue = ref<number>(defaultTimerSeconds);
  const bonusBlocked = ref<boolean>(false);
  const showErrorMessage = ref<boolean>(false);
  
  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();
  const { getContent } = useProjectMethods();
  
  const checkStorageTimer = ():void => {
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
  
  const blockBonus = ():void => {
    localStorage.setItem('bonusTimer', new Date().toISOString());
    timerValue.value = defaultTimerSeconds;
    bonusBlocked.value = true;
    showErrorMessage.value = true;
  };
  
  const openBonus = ():void => {
    localStorage.removeItem('bonusTimer');
    bonusBlocked.value = false;
  };
  
  const { addBonusCode } = useCoreBonusApi();
  const { showBonusCodeNotification } = useBonusStore();
  const sendBonus = async ():Promise<void> => {
    if (!bonusValue.value || bonusBlocked.value) return;
    
    try {
      const response = await addBonusCode(bonusValue.value, 1);
      showBonusCodeNotification(response.status);
    } catch (err: any) {
      if (err.response?.status === 400 && err.data?.error?.code === 5) {
        blockBonus();
      } else showBonusCodeNotification(3);
    } finally {
      bonusValue.value = '';
    }
  };
  
  onMounted(() => {
    checkStorageTimer();
  });
</script>

<style src="~/assets/styles/components/bonuses/promo-code.scss" lang="scss" />
