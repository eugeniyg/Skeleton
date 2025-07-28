<template>
  <div class="referral-card">
    <div
      v-if="bonusTitle"
      class="referral-card__title"
      v-html="DOMPurify.sanitize(marked.parseInline(bonusTitle || '') as string, { FORBID_TAGS: ['style'] })"
    />

    <div class="referral-card__media">
      <atomic-picture class="referral-card__picture" :src="image" />
    </div>

    <div class="referral-card__content">
      <div class="referral-card__item">
        <div class="referral-card__item-header" data-tooltip-parent>
          <span class="referral-card__item-title">
            {{ getContent(referralContent, defaultLocaleReferralContent, 'card.totalReferrals.title') }}
          </span>
          <atomic-tooltip :text="totalReferralsTooltip" />
        </div>

        <div class="referral-card__item-counter">
          <span class="referral-card__item-count" :class="accentClass">{{ props.totalCount }}</span>
          <template v-if="referralMaxCount">
            <span class="referral-card__item-count-divider">/</span>
            <span class="referral-card__item-count">{{ referralMaxCount }}</span>
          </template>
        </div>
      </div>

      <template v-if="profile?.qualifiedReferralsCount">
        <div class="referral-card__item-divider" />

        <div class="referral-card__item">
          <div class="referral-card__item-header" data-tooltip-parent>
            <span class="referral-card__item-title">
              {{ getContent(referralContent, defaultLocaleReferralContent, 'card.qualifiedPlayers.title') }}
            </span>
            <atomic-tooltip :text="qualifiedPlayersTooltip" />
          </div>

          <div class="referral-card__item-counter">
            <span class="referral-card__item-count">{{ profile?.qualifiedReferralsCount }}</span>
          </div>
        </div>
      </template>
    </div>

    <div class="referral-card__footer">
      <referral-link-copy v-if="showCreateLink" :value="createLink" name="copyRefLink" />
      <referral-unavailable-msg v-if="isReferralDisabled" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';
  import { storeToRefs } from 'pinia';
  import DOMPurify from 'isomorphic-dompurify';
  import { marked } from 'marked';

  const { getReferralsSettings } = useCoreProfileApi();
  const { getBonuses } = useCoreBonusApi();

  const props = defineProps<{
    totalCount: number | null;
  }>();

  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { profile } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));
  const { getContent } = useProjectMethods();

  const image = computed(() => getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.image'));

  const totalReferralsTooltip = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.totalReferrals.tooltip');
  });

  const qualifiedPlayersTooltip = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.qualifiedPlayers.tooltip');
  });

  const cashBonusLabel = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.cashBonusLabel');
  });

  const freeSpinsBonusLabel = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.freeSpinsBonusLabel');
  });

  const cardBonusTitle = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.bonusTitle');
  });

  const accentClass = computed(() => {
    const total = props.totalCount ?? 0;
    const max = referralMaxCount.value ?? 0;
    return total && max && total >= max ? 'is-accent' : null;
  });

  const showCreateLink = computed(() => {
    const hasCode = Boolean(profile.value?.referralCode);
    const total = props.totalCount ?? 0;
    const max = referralMaxCount.value ?? 0;
    return hasCode && total < max;
  });

  const createLink = computed(() => {
    if (!window) return '';
    return `${window.location.host}/?ref=${profile.value?.referralCode}`;
  });

  const bonusTitle = ref<string>('');
  const referralMaxCount = ref<number | null>();
  const formattedTitle = ref<string>('');
  const bonusValue = ref<Maybe<any>>();
  const isReferralDisabled = ref<boolean>(false);

  const setBonusTitle = (bonus: Maybe<any>): string => {
    if (!bonus || bonus?.type === 1) {
      formattedTitle.value = cashBonusLabel.value;
    } else if (bonus?.type === 3 && bonus.assignConditions?.presets?.length) {
      formattedTitle.value = `${bonus.assignConditions?.presets[0]?.quantity} ${freeSpinsBonusLabel.value}`;
    }

    return cardBonusTitle.value?.replace('{bonus}', `<span>${formattedTitle.value}</span>`);
  };

  const getBonusesData = async () => {
    try {
      const { maxReferralCount, ownerBonusId, enabled } = await getReferralsSettings();

      const bonusParams = {
        bonusIds: [ownerBonusId],
        currency: activeAccount.value?.currency,
        triggerType: 11,
      };

      const [bonus] = await getBonuses(bonusParams);
      bonusValue.value = bonus;
      isReferralDisabled.value = !enabled;
      referralMaxCount.value = maxReferralCount || null;
    } catch (error) {
      console.error('Error fetching bonuses:', error);
    }
  };

  watch(
    () => activeAccount.value?.currency,
    () => {
      getBonusesData();
    }
  );

  watch(
    [() => bonusValue.value, () => cardBonusTitle.value, () => formattedTitle.value, () => cashBonusLabel.value],
    () => {
      bonusTitle.value = setBonusTitle(bonusValue.value);
    }
  );

  onMounted(getBonusesData);
</script>

<style src="~/assets/styles/components/referral/card.scss" lang="scss" />
