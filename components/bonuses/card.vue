<template>
  <div class="bonuses-card">
    <div class="bonuses-card__container">
      <div class="bonuses-card__header">
        <bonuses-badge-type :mode="props.isFreeSpin ? 3 : props.bonusInfo.bonusType" />

        <bonuses-badge-game
          v-if="props.isFreeSpin"
          v-bind="props.bonusInfo"
        />

        <bonuses-badge-status
          :bonusInfo="props.bonusInfo"
          :isDeposit="props.isDeposit"
        />
      </div>

      <div class="bonuses-card__body">
        <div class="bonuses-card__name">
          <span class="bonuses-card__name-text">
            {{ props.bonusInfo.name }}
          </span>

          <span class="bonuses-card__name-value">{{ bonusValue }}</span>
        </div>

        <bonuses-min-deposit
          v-if="props.isDeposit"
          :bonusInfo="props.bonusInfo as IBonus"
          :label="getContent(bonusesContent, defaultLocaleBonusesContent, 'minDeposit')"
        />

        <bonuses-wager
          v-if="!isFreeSpin"
          :bonusInfo="props.bonusInfo"
          :label="getContent(bonusesContent, defaultLocaleBonusesContent, 'wager')"
        />

        <bonuses-info-button :label="getContent(bonusesContent, defaultLocaleBonusesContent, 'moreInfo')" />

        <template v-if="!props.isDeposit || props.bonusInfo.status === 2">
          <bonuses-freespin-progress
            v-if="props.isFreeSpin"
            :bonusInfo="props.bonusInfo as IPlayerFreeSpin"
          />

          <bonuses-wager-progress
            v-else
            :bonusInfo="props.bonusInfo as IPlayerBonus"
            :wagerLabel="getContent(bonusesContent, defaultLocaleBonusesContent, 'wager')"
            :waitingText="getContent(bonusesContent, defaultLocaleBonusesContent, 'waitingResults')"
          />
        </template>
      </div>

      <div class="bonuses-card__actions">
        <div v-if="props.isDeposit || props.bonusInfo.status === 1" class="bonuses-card__activator">
          <button-base
            class="bonuses-card__activate-btn"
            type="primary"
            size="md"
          >
            {{ activateLabel }}
          </button-base>

          <bonuses-timer
            v-if="activationExpired"
            :expiredAt="activationExpired"
          />
        </div>

        <button-base
          v-if="!props.isDeposit"
          type="ghost"
          size="xs"
        >
          {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLabel') }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBonus, IPlayerBonus, IPlayerFreeSpin } from "@skeleton/core/types";
  import type {IProfileBonuses} from "~/types";

  const props = defineProps<{
    bonusInfo: IPlayerBonus|IPlayerFreeSpin|IBonus;
    isFreeSpin?: boolean;
    isDeposit?: boolean;
  }>();

  const { formatBalance, getContent } = useProjectMethods();

  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const bonusValue = computed<string|undefined>(() => {
    if (props.isFreeSpin) return `${props.bonusInfo.count} FS`;
    if (props.isDeposit || props.bonusInfo.status === 1) return undefined;
    if (props.bonusInfo.type === 1) {
      const { currency, amount } = formatBalance(props.bonusInfo.currency, props.bonusInfo.amount);
      return `${amount} ${currency}`;
    }
    return undefined;
  });

  const activateLabel = computed<string>(() => {
    if (props.isDeposit) return getContent(bonusesContent, defaultLocaleBonusesContent, 'activateDeposit');
    if (props.isFreeSpin) return getContent(bonusesContent, defaultLocaleBonusesContent, 'activateFreeSpin');
    return getContent(bonusesContent, defaultLocaleBonusesContent, 'activateCash');
  })

  const activationExpired = computed<string|undefined>(() => {
    if (props.bonusInfo.status === 2) return undefined;

    if (props.isDeposit && props.bonusInfo.triggerConditions.availableTo) {
      return props.bonusInfo.triggerConditions.availableTo;
    }

    return props.bonusInfo.activationExpiredAt;
  })
</script>


<style src="~/assets/styles/components/bonuses/card.scss" lang="scss"/>