<template>
  <div class="card-bonuses" :class="{'is-active': props.bonus.status === 2}">
    <div class="card-bonuses__body">
      <div class="card-bonuses__header">
        <h4 class="card-bonuses__title">{{ props.bonus.name }}</h4>

        <form-input-toggle
          v-if="props.mode === 'bonus' || !props.bonus.usedCount"
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

          <nuxt-link
            v-if="props.mode === 'free-spin' && gameInfo"
            :to="localizePath(`/games/${gameInfo.identity}?real=true`)"
            class="card-bonuses__link"
          >
            Game: {{ gameInfo.name }}
          </nuxt-link>
        </div>
      </div>

      <div class="card-bonuses__amount">
        <div class="card-bonuses__value">
          <template v-if="props.mode === 'bonus'">
            {{ balanceFormat.amount }} {{ balanceFormat.currency }}
          </template>

          <template v-else-if="props.bonus.usedCount">
            {{ props.bonus.usedCount }} from {{ props.bonus.count }}FS
          </template>

          <template v-else>
            {{ props.bonus.count }}FS
          </template>
        </div>

        <div class="card-bonuses__msg">
          <template v-if="expiredAtDate">
            <atomic-icon id="history" />

            <div class="card-bonuses__date">
              {{ expiredAtDate }}
            </div>
          </template>

          <span v-if="props.mode === 'bonus' || !props.bonus.usedCount" class="trash-icon">
            <button @click="emit('removeBonus')">
              <atomic-icon id="trash"/>
            </button>
          </span>

        </div>
      </div>

      <div v-if="props.mode === 'bonus'" class="card-bonuses__progress" :class="{'is-riched': isRiched, 'is-greater-zero': greaterZero}">
        <div class="card-bonuses__progress-line" :style="{'--progress': `${props.bonus.currentWagerPercentage}%`}"></div>
        <span class="card-bonuses__progress-value">{{ props.bonus.currentWagerPercentage }}%</span>
        <span class="card-bonuses__progress-value">100%</span>
      </div>

      <div v-else class="card-bonuses__progress" :class="{'is-riched': isRiched, 'is-greater-zero': greaterZero}">
        <div class="card-bonuses__progress-line" :style="{'--progress': `${props.bonus.progress}%`}" />
        <span class="card-bonuses__progress-value">{{ props.bonus.usedCount }} FS</span>
        <span class="card-bonuses__progress-value">{{ props.bonus.count }} FS</span>
      </div>

      <div v-if="isRiched" class="card-bonuses__achive">
        <atomic-icon id="clock"/>
        <span>{{ props.content?.waitingResult }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerFreeSpin, IGame, IPlayerBonus } from "@skeleton/core/types";
  import type { IProfileBonuses } from '~/types';

  const props = defineProps<{
    bonus: IPlayerBonus|IPlayerFreeSpin,
    content?: IProfileBonuses['cashBonuses'],
    mode: 'bonus'|'free-spin'
  }>();

  const dayjs = useDayjs();
  const { formatBalance, localizePath } = useProjectMethods();
  const balanceFormat = computed(() => formatBalance(props.bonus.currency, props.bonus.amount));
  const tooltipContent = computed(() => {
    const bonusWagerText = props.content?.casinoWagerLabel.replace('{wager}', `${props.bonus.wagerCasino}`);
    const sportsbookWagerText = props.content?.sportsbookWagerLabel.replace('{wager}', `${props.bonus.wagerSportsbook}`);
    return `${bonusWagerText}</br>${sportsbookWagerText}`;
  });

  const dateFormat = 'DD.MM.YYYY, HH:mm';
  const expiredAtDate = computed(() => {
    if (props.bonus.status === 2) {
      if (props.bonus.wageringExpiredAt) {
        return dayjs(props.bonus.wageringExpiredAt).format(dateFormat);
      } return undefined;
    }

    if (props.bonus.activationExpiredAt) {
      return dayjs(props.bonus.activationExpiredAt).format(dateFormat);
    }

    if (props.bonus.wageringExpiredAt) {
      return dayjs(props.bonus.wageringExpiredAt).format(dateFormat);
    }

    return undefined;
  });

  const emit = defineEmits(['switchBonus', 'removeBonus']);
  const clickToggle = ():void => {
    emit('switchBonus');
  };

  const isRiched = computed(() => {
    if (props.mode === 'bonus') return props.bonus.currentWagerPercentage === 100;
    return props.bonus.progress === 100;
  });

  const greaterZero = computed(() => {
    if (props.mode === 'bonus') return (props.bonus.currentWagerPercentage || 0) > 0;
    return (props.bonus.progress || 0) > 0;
  });

  const gameInfo = ref<IGame|undefined>();
  const getGameData = async ():Promise<void> => {
    const { getGamesInfo } = useCoreGamesApi();
    gameInfo.value = await getGamesInfo(props.bonus.gameId);
  }

  onMounted(() => {
    if (props.mode === 'free-spin') getGameData();
  })
</script>

<style src="~/assets/styles/components/card/bonuses.scss" lang="scss" />

