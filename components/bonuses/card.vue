<template>
  <div class="bonuses-card" :class="{ 'is-active': !props.isDeposit && props.bonusInfo.status === 2 }">
    <div class="bonuses-card__container">
      <div class="bonuses-card__header">
        <bonuses-badge-type :mode="badgeType" />

        <bonuses-badge-game v-if="freeSpinGameInfo" :game-info="freeSpinGameInfo" />

        <bonuses-badge-status :status="badgeStatus" />
      </div>

      <div class="bonuses-card__body">
        <div class="bonuses-card__name">
          <span class="bonuses-card__name-text" :class="{ 'bonuses-card__name--large': !bonusValue }">
            {{ props.bonusInfo.name }}
          </span>

          <span v-if="bonusValue" class="bonuses-card__name-value">{{ bonusValue }}</span>
        </div>

        <bonuses-min-deposit v-if="props.isDeposit" :bonus-info="props.bonusInfo as IBonus" />

        <bonuses-wager v-if="showBonusWagers" :bonus-info="props.bonusInfo" />

        <bonuses-info-button @click="showBonusInfo" />

        <template v-if="!props.isDeposit && props.bonusInfo.status === 2">
          <bonuses-freespin-progress v-if="props.isFreeSpin" :bonus-info="props.bonusInfo as IPlayerFreeSpin" />

          <bonuses-wager-progress v-else :bonus-info="props.bonusInfo as IPlayerBonus" />
        </template>
      </div>

      <div class="bonuses-card__actions">
        <div v-if="props.isDeposit || props.bonusInfo.status === 1 || expiredDate" class="bonuses-card__activator">
          <button-base
            v-if="props.isDeposit || props.bonusInfo.status === 1"
            class="bonuses-card__activate-btn"
            type="primary"
            size="md"
            :is-disabled="props.loading"
            @click="emit('activate')"
          >
            <atomic-spinner :is-shown="props.loading" />
            {{ activateLabel }}
          </button-base>

          <bonuses-timer v-if="expiredDate" :expired-at="expiredDate" />
        </div>

        <button-base v-if="!props.isDeposit" type="ghost-gray" size="xs" @click="emit('remove')">
          {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.cancelLabel') }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus, IGame, IPlayerBonus, IPlayerFreeSpin } from '@skeleton/core/types';

  const props = defineProps<{
    bonusInfo: Record<string, any>;
    isFreeSpin?: boolean;
    isDeposit?: boolean;
    isCash?: boolean;
    loading?: boolean;
  }>();

  const emit = defineEmits(['activate', 'remove']);
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const { formatBalance, getContent } = useProjectMethods();
  const { openModal } = useModalStore();

  const bonusValue = computed<string | undefined>(() => {
    if (props.isFreeSpin) return `${(props.bonusInfo as IPlayerFreeSpin).count} FS`;
    if (props.isDeposit && props.bonusInfo.type === 3) {
      const freeSpinCount = props.bonusInfo.assignConditions?.presets?.[0].quantity;
      return freeSpinCount ? `${freeSpinCount} FS` : undefined;
    }
    if (props.isCash && props.bonusInfo.status === 2) {
      const { currency, amount } = formatBalance(
        (props.bonusInfo as IPlayerBonus).currency,
        (props.bonusInfo as IPlayerBonus).amount
      );
      return `${amount} ${currency}`;
    }
    return undefined;
  });

  const activateLabel = computed<string>(() => {
    if (props.isDeposit)
      return getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'bonuses.activateDeposit'
      );

    if (props.isFreeSpin)
      return getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'bonuses.activateFreeSpin'
      );

    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'bonuses.activateCash'
    );
  });

  const expiredDate = computed<string | undefined>(() => {
    if (props.isDeposit && props.bonusInfo.triggerConditions.availableTo) {
      return props.bonusInfo.triggerConditions.availableTo;
    }

    if (props.bonusInfo.status === 1 && props.bonusInfo.activationExpiredAt) return props.bonusInfo.activationExpiredAt;

    if (props.isFreeSpin && props.bonusInfo.status === 2 && props.bonusInfo.expiredAt) return props.bonusInfo.expiredAt;

    if (props.bonusInfo.status === 2 && props.bonusInfo.wageringExpiredAt) return props.bonusInfo.wageringExpiredAt;

    return undefined;
  });

  const badgeType = computed<number>(() => {
    if (props.isFreeSpin) return 3;
    if (props.isDeposit) return props.bonusInfo.type as number;
    return (props.bonusInfo as IPlayerBonus).bonusType;
  });

  const badgeStatus = computed<'active' | 'available' | 'available-deposit'>(() => {
    if (props.isDeposit) return 'available-deposit';
    if (props.bonusInfo.status === 1) return 'available';
    return 'active';
  });

  const showBonusWagers = computed<boolean>(() => {
    const depositFreeSpin = props.isDeposit && props.bonusInfo.type === 3;
    return !props.isFreeSpin && !depositFreeSpin && (props.bonusInfo.wagerCasino || props.bonusInfo.wagerSportsbook);
  });

  const freeSpinGameInfo = ref<IGame | undefined>();
  const getGameInfo = async (): Promise<void> => {
    const gameId = (props.bonusInfo as IPlayerFreeSpin).gameId || props.bonusInfo.assignConditions?.gameId;
    if (!gameId) return;

    try {
      const { getGamesInfo } = useCoreGamesApi();
      freeSpinGameInfo.value = await getGamesInfo(gameId);
    } catch {
      freeSpinGameInfo.value = undefined;
    }
  };

  const modalBonusInfo = ref<Record<string, any> | undefined>();
  const showBonusInfo = () => {
    modalBonusInfo.value = {
      bonusType: props.isFreeSpin ? 3 : undefined,
      ...props.bonusInfo,
      bonusValue: bonusValue.value,
      badgeType: badgeType.value,
      badgeStatus: badgeStatus.value,
      expiredDate: expiredDate.value,
      freeSpinGameInfo: freeSpinGameInfo.value,
    };
    openModal('bonus-details', { props: { bonusInfo: modalBonusInfo } });
  };

  onMounted(() => {
    if (props.isFreeSpin || (props.isDeposit && props.bonusInfo.type === 3)) {
      getGameInfo();
    }
  });
</script>

<style src="~/assets/styles/components/bonuses/card.scss" lang="scss" />
