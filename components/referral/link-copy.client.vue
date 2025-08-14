<template>
  <label class="referral-link-copy" :for="props.name" data-tooltip-parent :class="{ 'is-focused': tooltipVisible }">
    <div class="referral-link-copy__row">
      <transition name="fade" mode="out-in">
        <div v-if="tooltipVisible" class="referral-link-copy__tooltip">
          {{ copyMsg }}
        </div>
      </transition>

      <div class="referral-link-copy__field-wrap">
        <input
          :id="props.name"
          ref="copyInput"
          :value="displayValue"
          class="referral-link-copy__field"
          readonly
          :name="props.name"
        />
        <div ref="cloneElement" class="referral-link-copy__clone">{{ props.value }}</div>
      </div>

      <button class="referral-link-copy__desktop-btn" @click.prevent="copyValue">
        <atomic-icon id="copy" />
      </button>
    </div>

    <button-base class="referral-link-copy__mobile-btn" @click.prevent="copyValue">
      <span class="referral-link-copy__mobile-btn-label">{{ btnLabel }}</span>
      <atomic-icon id="copy" />
    </button-base>
  </label>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';
  import debounce from 'lodash/debounce';
  import type { IProfileReferral } from '~/types';
  import { getContent } from '#imports';

  const props = defineProps<{
    name: string;
    value?: string;
  }>();

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));

  const btnLabel = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.copyLink.btnLabel')
  );
  const copyMsg = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.copyLink.msg')
  );

  const copyInput = useTemplateRef('copyInput');

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const showTooltip = (): void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const copyValue = (): void => {
    copyInput.value?.select();
    copy(props.value || '');
    showTooltip();
  };

  const displayValue = ref<string>('');
  const cloneElement = useTemplateRef('cloneElement');

  const getDisplayValue = (): string => {
    if (!props.value || !copyInput.value || !cloneElement.value) return '';
    const inputWidth = copyInput.value.scrollWidth + 2;
    if (cloneElement.value?.clientWidth < inputWidth) {
      const lastCount = 5;
      const value = props.value;

      const firstCount = Math.max(10, value.length - 10);
      const firstPart = value.slice(0, firstCount);
      const lastPart = value.slice(-lastCount);
      return `${firstPart}...${lastPart}`;
    }
    return props.value || '';
  };

  const updateDisplayValue = async () => {
    displayValue.value = getDisplayValue();
  };
  
  watch(
    () => props.value,
    async () => {
      await nextTick();
      await updateDisplayValue();
    },
    { immediate: true }
  );

  const debouncedUpdateDisplayValue = debounce(updateDisplayValue, 200);

  onMounted(() => {
    window.addEventListener('resize', debouncedUpdateDisplayValue);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debouncedUpdateDisplayValue);
  });
</script>

<style src="~/assets/styles/components/referral/link-copy.scss" lang="scss" />
