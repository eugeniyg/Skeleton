<template>
  <div class="referral-info">
    <div
      ref="descriptionRef"
      class="referral-info__description"
      :class="{ 'is-expanded': isExpanded }"
      v-html="
        DOMPurify.sanitize(marked.parse(descriptionText || '') as string, {
          FORBID_TAGS: ['style'],
        })
      "
    />

    <button-base v-if="displayMoreBtn" class="referral-info__more-btn" type="ghost" @click="expandDescription">
      <span>{{ moreButtonLabel }}</span>
      <atomic-icon id="arrow_expand-close" />
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import DOMPurify from 'isomorphic-dompurify';
  import { marked } from 'marked';
  import type { IProfileReferral } from '~/types';
  import { getContent } from '#imports';

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));

  const descriptionText = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'info.description')
  );
  const moreButtonLabel = computed(() =>
    getContent(referralContent.value, defaultLocaleReferralContent.value, 'info.showMoreLabel')
  );

  const descriptionRef = useTemplateRef('descriptionRef');
  const displayMoreBtn = ref(false);
  const isExpanded = ref(false);

  const checkDisplayMoreBtn = async () => {
    await nextTick();
    if (descriptionRef.value) {
      displayMoreBtn.value = descriptionRef.value?.scrollHeight > descriptionRef.value?.offsetHeight;
    }
  };

  const expandDescription = () => {
    isExpanded.value = true;
    displayMoreBtn.value = false;
  };

  watch(
    () => descriptionText.value,
    () => {
      checkDisplayMoreBtn();
    }
  );

  onMounted(() => {
    checkDisplayMoreBtn();
    window.addEventListener('resize', checkDisplayMoreBtn);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDisplayMoreBtn);
  });
</script>

<style src="~/assets/styles/components/referral/info.scss" lang="scss" />
