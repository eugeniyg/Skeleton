<template>
  <div class="referral-card">
    <div class="referral-card__title">{{ title }}</div>

    <div class="referral-card__media">
      <atomic-picture class="referral-card__picture" :src="image" />
    </div>

    <div class="referral-card__content">
      <div class="referral-card__item">
        <div class="referral-card__item-header" data-tooltip-parent>
          <span class="referral-card__item-title">
            {{ getContent(referralContent, defaultLocaleReferralContent, 'card.totalReferrals.title') }}

            <span>{{ referralId }}</span>
          </span>
          <atomic-tooltip :text="totalReferralsTooltip" />
        </div>

        <div class="referral-card__item-counter">
          <span class="referral-card__item-count">{{ props.totalCount }}</span>
          <template v-if="profile?.referralMaxCount">
            <span class="referral-card__item-count-divider">/</span>
            <span class="referral-card__item-count">{{ profile?.referralMaxCount }}</span>
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
      <referral-link-copy v-if="profile?.referralCode" :value="createLink()" name="copyRefLink" />
      <referral-unavailable-msg v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';

  const { getReferralsSettings } = useCoreProfileApi();

  const props = defineProps<{
    totalCount: number;
  }>();

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));
  const { getContent } = useProjectMethods();

  const image = computed(() => getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.image'));
  const title = computed(() => getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.title'));

  const totalReferralsTooltip = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.totalReferrals.tooltip');
  });

  const qualifiedPlayersTooltip = computed(() => {
    return getContent(referralContent.value, defaultLocaleReferralContent.value, 'card.qualifiedPlayers.tooltip');
  });

  const createLink = (): string => {
    return `${window.location.host}/?ref=${profile.value?.referralCode}`;
  };

  onMounted(async () => {
    try {
      const { maxReferralCount, ownerBonusId } = await getReferralsSettings();
      console.log({ maxReferralCount, ownerBonusId });
    } catch (error) {
      console.error('Error fetching referral settings:', error);
    }
  });
</script>

<style src="~/assets/styles/components/referral/card.scss" lang="scss" />
