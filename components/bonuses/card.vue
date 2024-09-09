<template>
  <div
    class="bonuses-card"
    :class="{ 'is-active': !props.isDeposit && props.bonusInfo.status === 2 }"
  >
    <div class="bonuses-card__container">
      <div class="bonuses-card__header">
        <bonuses-badge-type
          :mode="badgeType"
          :contentTypes="getContent(bonusesContent, defaultLocaleBonusesContent, `types`)"
        />

        <bonuses-badge-game
          v-if="props.isFreeSpin || (props.isDeposit && props.bonusInfo.type === 3)"
          :bonusInfo="props.bonusInfo"
        />

        <bonuses-badge-status
          :status="badgeStatus"
          :title="badgeStatusLabel"
          :subtitle="getContent(bonusesContent, defaultLocaleBonusesContent, `statuses.nextDeposit`)"
        />
      </div>

      <div class="bonuses-card__body">
        <div class="bonuses-card__name">
          <span class="bonuses-card__name-text" :class="{ 'bonuses-card__name--large': !bonusValue }">
            {{ props.bonusInfo.name }}
          </span>

          <span v-if="bonusValue" class="bonuses-card__name-value">{{ bonusValue }}</span>
        </div>

        <bonuses-min-deposit
          v-if="props.isDeposit"
          :bonusInfo="props.bonusInfo as IBonus"
          :label="getContent(bonusesContent, defaultLocaleBonusesContent, 'minDeposit')"
        />

        <bonuses-wager
          v-if="showBonusWagers"
          :bonusInfo="props.bonusInfo"
          :label="getContent(bonusesContent, defaultLocaleBonusesContent, 'wager')"
        />

        <bonuses-info-button
          :label="getContent(bonusesContent, defaultLocaleBonusesContent, 'moreInfo')"
          @click="showBonusInfo"
        />

        <template v-if="!props.isDeposit && props.bonusInfo.status === 2">
          <bonuses-freespin-progress
            v-if="props.isFreeSpin"
            :bonusInfo="props.bonusInfo as IPlayerFreeSpin"
          />

          <bonuses-wager-progress
            v-else
            :bonusInfo="props.bonusInfo as IPlayerBonus"
            :wagerLabel="getContent(bonusesContent, defaultLocaleBonusesContent, 'wager')"
            :waitingText="getContent(bonusesContent, defaultLocaleBonusesContent, 'waitingResult')"
          />
        </template>
      </div>

      <div class="bonuses-card__actions">
        <div v-if="props.isDeposit || props.bonusInfo.status === 1 || expiredDate" class="bonuses-card__activator">
          <button-base
            v-if="props.isDeposit || props.bonusInfo.status === 1"
            class="bonuses-card__activate-btn"
            type="primary"
            size="md"
            :isDisabled="props.loading"
            @click="emit('activate')"
          >
            <atomic-spinner :is-shown="props.loading"/>
            {{ activateLabel }}
          </button-base>

          <bonuses-timer
            v-if="expiredDate"
            :expiredAt="expiredDate"
            :timerContent="getContent(bonusesContent, defaultLocaleBonusesContent, 'timer')"
          />
        </div>

        <button-base
          v-if="!props.isDeposit"
          type="ghost"
          size="xs"
          @click="emit('remove')"
        >
          {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLabel') }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus, IPlayerBonus, IPlayerFreeSpin } from "@skeleton/core/types";
  import type { IProfileBonuses } from "~/types";

  const props = defineProps<{
    bonusInfo: IPlayerBonus|IPlayerFreeSpin|IBonus;
    isFreeSpin?: boolean;
    isDeposit?: boolean;
    isCash?: boolean;
    loading?: boolean;
  }>();

  const emit = defineEmits(['activate', 'remove']);
  const bonusStore = useBonusStore();
  const { showModal } = useLayoutStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const { formatBalance, getContent } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const bonusValue = computed<string|undefined>(() => {
    if (props.isFreeSpin) return `${(props.bonusInfo as IPlayerFreeSpin).count} FS`;
    if (props.isDeposit && props.bonusInfo.type === 3) return 'Count FS';
    if (props.isCash && props.bonusInfo.status === 2) {
      const { currency, amount } = formatBalance((props.bonusInfo as IPlayerBonus).currency, (props.bonusInfo as IPlayerBonus).amount);
      return `${amount} ${currency}`;
    }
    return undefined;
  });

  const activateLabel = computed<string>(() => {
    if (props.isDeposit) return getContent(bonusesContent.value, defaultLocaleBonusesContent.value, 'activateDeposit');
    if (props.isFreeSpin) return getContent(bonusesContent.value, defaultLocaleBonusesContent.value, 'activateFreeSpin');
    return getContent(bonusesContent.value, defaultLocaleBonusesContent.value, 'activateCash');
  })

  const expiredDate = computed<string|undefined>(() => {
    if (props.isDeposit && props.bonusInfo.triggerConditions.availableTo) {
      return props.bonusInfo.triggerConditions.availableTo;
    }

    if (props.bonusInfo.status === 1 && props.bonusInfo.activationExpiredAt) return props.bonusInfo.activationExpiredAt;

    if (props.bonusInfo.status === 2 && props.bonusInfo.wageringExpiredAt) return props.bonusInfo.wageringExpiredAt;

    return undefined;
  })

  const badgeType = computed<number>(() => {
    if (props.isFreeSpin) return 3;
    if (props.isDeposit) return props.bonusInfo.type as number;
    return (props.bonusInfo as IPlayerBonus).bonusType;
  })

  const badgeStatus = computed<'active'|'available'|'available-deposit'>(() => {
    if (props.isDeposit) return 'available-deposit';
    if (props.bonusInfo.status === 1) return 'available';
    return 'active';
  })

  const badgeStatusLabel = computed<string|undefined>(() => {
    const contentKey = badgeStatus.value.includes('available') ? 'available' : 'active';
    return getContent(bonusesContent.value, defaultLocaleBonusesContent.value, `statuses.${contentKey}`);
  })

  const showBonusWagers = computed<boolean>(() => {
    const depositFreeSpin = props.isDeposit && props.bonusInfo.type === 3;
    return !props.isFreeSpin && !depositFreeSpin && (props.bonusInfo.wagerCasino || props.bonusInfo.wagerSportsbook);
  })

  const showBonusInfo = () => {
    depositMoreInfoBonus.value = {
      bonusType: props.isFreeSpin ? 3 : undefined,
      ...props.bonusInfo,
      bonusValue: bonusValue.value,
      badgeType: badgeType.value,
      badgeStatus: badgeStatus.value,
      expiredDate: expiredDate.value,
    };
    showModal('walletBonusDetails');
  }
</script>


<style src="~/assets/styles/components/bonuses/card.scss" lang="scss"/>