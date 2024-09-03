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
          v-bind="bonuses.bonus"
        />

        <bonuses-fs
          v-if="props.type === 'fs'"
          :count="15"
          :total-count="100"
          :progress="15"
        />
      </div>

      <div class="bonuses-card__actions">
        <button-base
          v-if="props.type === 'fs'"
          class="bonuses-card__spin-btn"
          type="primary"
          size="md"
        >Spin</button-base>

        <button-base
          v-if="props.type === 'percent' && props.status === 'future'"
          class="bonuses-card__locked-btn"
          type="primary"
          size="md"
          disabled
        >
          <atomic-icon id="locked"/>
          <span>Active after 4 deposit</span>
        </button-base>

        <button-base
          v-if="props.type === 'cash'"
          class="bonuses-card__locked-btn"
          type="primary"
          size="md"
          disabled
        >
          Claim Bonus
        </button-base>



        <div v-if="props.type === 'fs' || props.type === 'cashback'" class="bonuses-card__activator">
          <button-base class="bonuses-card__activate-btn" type="primary" size="md">Activate</button-base>
          <bonuses-timer expired-at="2024-09-20T09:25:51.331Z" />
        </div>

        <button-base
          v-if="props.type === 'fs' || props.type === 'cashback'"
          type="ghost"
          size="xs"
        >Delete this bonus</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {IPlayerBonus, IPlayerFreeSpin} from "@skeleton/core/types";

  const props = defineProps<{
    bonusInfo: IPlayerBonus|IPlayerFreeSpin;
    isFreeSpin?: boolean;
    isDeposit?: boolean;
  }>();

  const { formatBalance } = useProjectMethods();

  const bonusValue = computed<string|undefined>(() => {
    if (props.isFreeSpin) return `${props.bonusInfo.count} FS`;
    if (props.isDeposit || props.bonusInfo.status === 1) return undefined;
    if (props.bonusInfo.type === 1) {
      const { currency, amount } = formatBalance(props.bonusInfo.currency, props.bonusInfo.amount);
      return `${amount} ${currency}`;
    }
    return undefined;
  });
</script>


<style src="~/assets/styles/components/bonuses/card.scss" lang="scss"/>