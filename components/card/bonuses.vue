<template>
  <div class="card-bonuses" :class="{'is-active': isChecked}">
    <div class="card-bonuses__body">
      <div class="card-bonuses__header">
        <h4 class="card-bonuses__title">{{ props.title }}</h4>

        <form-input-toggle
          name="toggle"
          :value="isChecked"
          @change="clickToggle"
        />

        <div class="card-bonuses__info">
          <atomic-tooltip
            align="bottom"
            :text="props.tooltipText"
          >
            <span class="card-bonuses__info-title">Wager requirements</span>
          </atomic-tooltip>
        </div>
      </div>

      <div class="card-bonuses__amount">
        <div class="card-bonuses__value">{{ props.amountValue }}</div>
        <div class="card-bonuses__msg">
          <atomic-icon id="history"/>
          {{ getFormatDate(props.expireDate) }}
        </div>
      </div>

      <div class="card-bonuses__progress" :class="{'is-riched': isRiched, 'is-greater-zero': greaterZero}">
        <div class="card-bonuses__progress-line" :style="{'--progress': `${props.progressValue}%`}"></div>
        <span class="card-bonuses__progress-value">{{ props.progressValue }}%</span>
        <span class="card-bonuses__progress-value">100%</span>
      </div>

      <div class="card-bonuses__achive" v-if="isRiched">
        <atomic-icon id="clock"/>
        <span>Waiting for results of Sportsbook bets</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { getFormatDate } = useProjectMethods();
  const props = defineProps<{
    title: string,
    tooltipText: string,
    progressValue: number,
    amountValue: string,
    expireDate: string
  }>();

  const isChecked = ref<boolean>(false);

  const clickToggle = () => {
    isChecked.value = !isChecked.value;
  };

  const isRiched = computed(() => props.progressValue === 100);
  const greaterZero = computed(() => props.progressValue > 0);
</script>

<style lang="scss">
.cards-bonuses {
  display: grid;
  grid-template-columns: var(--columns, 1fr);
  grid-gap: rem(16px);
  transition: all .2s ease;
  position: relative;

  ~ .cards-bonuses {
    @include media(md) {
      margin-top: rem(16px);
    }
  }

  &__title {
    @include font($heading-5);
    color: var(--white);
    grid-column: 1/2;
    margin: 24px 0 8px;
  }

  @include media(sm) {
    --columns: repeat(2, 1fr);

    &__title {
      grid-column: 1/3;
    }
  }

  @include media(xl) {
    --columns: repeat(3, 1fr);

    &__title {
      grid-column: 1/4;
    }
  }

  @include media(xxl) {
    --columns: repeat(4, 1fr);

    &__title {
      grid-column: 1/5;
    }
  }

}

.card-bonuses {
  color: var(--white);
  position: relative;
  border: 2px solid transparent;
  border-radius: 16px;
  min-height: rem(158px);
  user-select: none;

  &:before {
    content: '';
    position: absolute;
    top: rem(-2px);
    left: rem(-2px);
    right: rem(-2px);
    bottom: rem(-2px);
    border-radius: 16px;
    background-image: linear-gradient(107.86deg, #28263B 1.67%, #3D3D51 87.33%), linear-gradient(107.86deg, #19192F 1.67%, #28263B 87.33%);
  }

  &.is-active {
    &:before {
      background-image: linear-gradient(89.73deg, #FFDC8A 1.37%, #FFC12E 49.58%, #E6A409 98.17%);
    }
  }

  &__body {
    padding: rem(24px);
    background-image: linear-gradient(107.86deg, #28263B 1.67%, #3D3D51 87.33%), linear-gradient(107.86deg, #19192F 1.67%, #28263B 87.33%);
    border-radius: 14px;
    position: relative;
  }

  &__header {
    display: grid;
    grid-template-areas:
      "title toggle"
      "info toggle";
    grid-template-columns: 1fr auto;
    align-items: flex-start;
    margin-bottom: rem(8px);
    grid-row-gap: rem(4px);
    grid-column-gap: rem(8px);
    position: relative;

    .input-toggle {
      height: 0;
      transform: translateY(#{rem(12px)});
    }
  }

  &__title {
    @include font($body-1);
    color: var(--white);
    margin: 0;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__info {
    display: flex;
    grid-column-gap: rem(4px);
    align-items: center;

    .tooltip.is-show {
      .icon {
        --color: var(--yellow-500)
      }
    }
  }

  &__amount {
    @include font($heading-4);
    display: flex;
    margin-bottom: rem(16px);
    grid-column-gap: rem(8px);
  }

  &__value {
    flex-grow: 1;
    white-space: nowrap;
  }

  &__msg {
    color: var(--gray-400);
    @include font($body-0);
    display: flex;
    align-items: center;
    grid-column-gap: rem(2px);
    white-space: nowrap;

    .icon {
      --color: var(--gray-400);
    }
  }

  &__info-title {
    display: block;
    @include font($body-0);
    color: var(--yellow-500);
    cursor: pointer;
    position: relative;
    white-space: nowrap;

    &:after {
      position: absolute;
      content: '';
      border-bottom: 1px dashed var(--border-color, var(--yellow-500));
      bottom: 0;
      left: 0;
      right: 0;
    }

    &:hover {
      --border-color: transparent;
    }
  }

  &__progress {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "line line" "start end";
    grid-row-gap: rem(4px);

    &.is-riched {
      --line-bg: var(--green-600);
    }

    &.is-greater-zero {
      --start-value-color: var(--white);
    }

    &-line {
      width: 100%;
      border-radius: 2px;
      height: rem(4px);
      background-color: var(--gray-500);
      position: relative;
      overflow: hidden;
      transition: width .2s ease-in-out;
      grid-area: line;

      &:after {
        content: '';
        position: absolute;
        width: var(--progress, 0);
        left: 0;
        top: 0;
        bottom: 0;
        background-color: var(--line-bg, var(--blue-500));
      }
    }

    &-value {
      @include font($body-1);
      text-transform: uppercase;
      display: flex;

      &:nth-of-type(1) {
        grid-area: start;
        color: var(--start-value-color, var(--gray-400));
      }

      &:nth-of-type(2) {
        grid-area: end;
        justify-content: flex-end;
        color: var(--end-value-color, var(--gray-400));
      }
    }
  }

  &__achive {
    margin-top: rem(4px);
    @include font($body-1);
    display: flex;
    grid-column-gap: rem(4px);
    align-items: center;
    color: var(--gray-400);

    .icon {
      --color: var(--gray-400);
      --icon-size: 16px;
    }
  }
}
</style>
