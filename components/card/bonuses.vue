<template>
  <div class="card-bonuses" :class="{'is-active': props.bonus.status === 2}">
    <div class="card-bonuses__body">
      <div class="card-bonuses__header">
        <h4 class="card-bonuses__title">{{ props.bonus.name }}</h4>

        <form-input-toggle
          name="toggle"
          :value="props.bonus.status === 2"
          @change="clickToggle"
        />

        <div class="card-bonuses__info">
          <atomic-tooltip
            v-if="props.mode === 'bonus'"
            align="bottom"
            :text="tooltipContent"
          >
            <span class="card-bonuses__info-title">{{ props.content?.wagerHintLabel }}</span>
          </atomic-tooltip>

          <span v-if="props.mode === 'free-spin'" class="card-bonuses__link">
            <span class="label">Game:</span>
            <a class="title" href="#" @click.prevent>Sweet Bonanza Xmas</a>
          </span>
        </div>
      </div>

      <div class="card-bonuses__amount">
        <div class="card-bonuses__value">{{ balanceFormat.amount }} {{ balanceFormat.currency }}</div>
        <div class="card-bonuses__msg">
          <template v-if="expiredAtDate">
            <atomic-icon id="history" />

            <div class="card-bonuses__date">
              {{ expiredAtDate }}
            </div>
          </template>

          <span class="trash-icon">
            <button @click="emit('removeBonus')">
              <atomic-icon id="trash"/>
            </button>
          </span>

        </div>
      </div>

      <div class="card-bonuses__progress" :class="{'is-riched': isRiched, 'is-greater-zero': greaterZero}">
        <div class="card-bonuses__progress-line" :style="{'--progress': `${props.bonus.currentWagerPercentage}%`}"></div>
        <span class="card-bonuses__progress-value">{{ props.bonus.currentWagerPercentage }}%</span>
        <span class="card-bonuses__progress-value">100%</span>
      </div>

      <div v-if="isRiched" class="card-bonuses__achive">
        <atomic-icon id="clock"/>
        <span>{{ props.content?.waitingResult }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PlayerBonusInterface } from '@platform/frontend-core/dist/module';
  import { CashBonusesInterface } from '@skeleton/types';

  const props = defineProps<{
    bonus: PlayerBonusInterface,
    content?: CashBonusesInterface,
    mode: 'bonus'|'free-spin'
  }>();

  const { getFormatDate, formatBalance } = useProjectMethods();
  const balanceFormat = computed(() => formatBalance(props.bonus.currency, props.bonus.amount));
  const tooltipContent = computed(() => {
    const bonusWagerText = props.content?.casinoWagerLabel.replace('{wager}', `${props.bonus.wagerCasino}`);
    const sportsbookWagerText = props.content?.sportsbookWagerLabel.replace('{wager}', `${props.bonus.wagerSportsbook}`);
    return `${bonusWagerText}</br>${sportsbookWagerText}`;
  });

  const expiredAtDate = computed(() => {
    if (props.bonus.status === 2) {
      if (props.bonus.wageringExpiredAt) {
        return getFormatDate(props.bonus.wageringExpiredAt);
      } return undefined;
    }

    if (props.bonus.activationExpiredAt) {
      return getFormatDate(props.bonus.activationExpiredAt);
    }

    if (props.bonus.wageringExpiredAt) {
      return getFormatDate(props.bonus.wageringExpiredAt);
    }

    return undefined;
  });

  const emit = defineEmits(['switchBonus', 'removeBonus']);
  const clickToggle = ():void => {
    emit('switchBonus');
  };

  const isRiched = computed(() => props.bonus.currentWagerPercentage === 100);
  const greaterZero = computed(() => (props.bonus.currentWagerPercentage || 0) > 0);
</script>

<style src="~/assets/styles/components/card/bonuses.scss" lang="scss" />

