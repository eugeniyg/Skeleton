<template>
  <div class="limits">
    <div class="limits__header">
      <h1 class="limits__heading">Limits</h1>
      <div class="limits__mode">
        <span class="limits__mode-label">Advanced mode</span>
        <form-input-toggle
          name="toggle"
          :value="isAdvancedModeEnabled"
          @change="clickToggle"
        />
      </div>
    </div>

    <div class="limits__grid">
      <div
        v-if="isAdvancedModeEnabled"
        :class="makeFullWidth(deposit.periods)"
        class="limits__card"
      >
        <h4 class="limits__card-title" data-tooltip-parent>
          {{ deposit.title }}
          <atomic-tooltip v-if="isShowPeriods" v-bind="deposit.tooltip"/>
        </h4>

        <atomic-limits-periods
          v-if="isShowPeriods"
          :periods="deposit.periods"
          :is-show-edit="isShowEdit"
        />
        <p v-else class="limits__card-sub-title">{{ deposit.subTitle }}</p>

        <div class="limits__card-actions">
          <button-base type="primary">
            {{ deposit.buttons.primary.title }}
          </button-base>

          <button-base
            v-if="isShowPeriods && !isShowEdit"
            type="secondary"
            @click="isShowEdit = true"
          >
            {{ deposit.buttons.edit.base }}
          </button-base>

          <button-base
            v-if="isShowPeriods && isShowEdit"
            type="secondary"
            @click="isShowEdit = false"
          >
            {{ deposit.buttons.edit.done }}
          </button-base>

        </div>
      </div>

      <div class="limits__card">
        <h4 class="limits__card-title">{{ lossLimits.title }}</h4>
        <div class="limits__card-info is-text-center" v-html="lossLimits.info"/>
        <div class="limits__card-actions">
          <button-base type="primary">{{ lossLimits.buttons.primary.title }}</button-base>
        </div>
      </div>

      <div class="limits__card">
        <h4 class="limits__card-title">{{ wagerLimits.title }}</h4>
        <div class="limits__card-info is-text-center" v-html="wagerLimits.info"/>
        <div class="limits__card-actions">
          <button-base type="primary">{{ wagerLimits.buttons.primary.title }}</button-base>
        </div>
      </div>

      <div class="limits__card" session>
        <h4 class="limits__card-title">{{ sessionLimit.title }}</h4>

        <atomic-session-limits
          v-if="isShowSessionLimitValues"
          :items="sessionLimitValues"
          @remove="removeSessionLimit"
          @back="isShowSessionLimitValues = false"
        />
        <div class="limits__card-dropdown" v-else>

          <form-input-dropdown
            name="sessionLimitsDropdown"
            v-model:value="sessionLimitValue"
            v-bind="sessionLimit.dropdown"
          />
          <button-base
            type="primary"
            :is-disabled="!sessionLimitValue"
            @click="() => isShowSessionLimitValues = true"
          >{{ sessionLimit.buttons.submit.title }}
          </button-base>
        </div>

        <div class="limits__card-info" v-html="sessionLimit.info"/>
      </div>

      <div class="limits__card" cooling>
        <h4 class="limits__card-title">{{ coolingOff.title }}</h4>

        <atomic-session-limits
          v-if="isShowCoolingOffValues"
          :items="coolingOffValues"
          @remove="removeCoolingOff"
          @back="isShowCoolingOffValues = false"
        />
        <div class="limits__card-dropdown" v-else>

          <form-input-dropdown
            name="coolingOffDropdown"
            v-model:value="coolingOffValue"
            v-bind="coolingOff.dropdown"
          />
          <button-base
            type="primary"
            :is-disabled="!coolingOffValue"
            @click="() => isShowCoolingOffValues = true"
          >{{ coolingOff.buttons.submit.title }}
          </button-base>
        </div>

        <div class="limits__card-info" v-html="coolingOff.info"/>
      </div>

      <div class="limits__card" v-if="isAdvancedModeEnabled">
        <h2 class="limits__card-title">{{ selfExclusion.title }}</h2>

        <div class="limits__card-dropdown">
          <form-input-dropdown
            name="selfExclusionDropdown"
            v-model:value="selfExclusionValue"
            v-bind="selfExclusion.dropdown"
          />
          <button-base
            type="primary"
            :is-disabled="!selfExclusionValue"
          >{{ selfExclusion.buttons.submit.title }}
          </button-base>
        </div>

        <div class="limits__card-info" v-html="selfExclusion.info"/>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
  const {
    profileLimits: {
      deposit,
      coolingOff,
      lossLimits,
      sessionLimit,
      wagerLimits,
      selfExclusion,
    },
  } = useFakeStore();

  const sessionLimitValue = ref<string>('');
  const sessionLimitValues = ref<any[]>([]);
  const isShowSessionLimitValues = ref<boolean>(false);

  const coolingOffValue = ref<string>('');
  const coolingOffValues = ref<any[]>([]);
  const isShowCoolingOffValues = ref<boolean>(false);

  const selfExclusionValue = ref<string>('');

  const isAdvancedModeEnabled = ref<boolean>(false);
  const isShowPeriods = ref<boolean>(true);

  const isShowEdit = ref<boolean>(false);

  const clickToggle = () => {
    isAdvancedModeEnabled.value = !isAdvancedModeEnabled.value;
  };

  const removeCoolingOff = () => {
    coolingOffValue.value = '';
    isShowCoolingOffValues.value = false;
    coolingOffValues.value = [];
  };

  const removeSessionLimit = () => {
    sessionLimitValue.value = '';
    isShowSessionLimitValues.value = false;
    sessionLimitValues.value = [];
  };

  const makeFullWidth = (columns: any) => ({ 'is-full-width': Object.keys(columns).length > 1 });

  watch(sessionLimitValue, () => {
    if (sessionLimitValues.value.find((item) => item.value === sessionLimitValue.value)) return;

    sessionLimitValues.value.push(
      {
        value: sessionLimitValue.value,
        status: {
          type: 'pending',
          msg: 'Pending. The limit will change to 789 on 2022-04-19 23:44.',
        },
      },
    );
  });

  watch(coolingOffValue, () => {
    if (coolingOffValues.value.find((item) => item.value === coolingOffValue.value)) return;

    coolingOffValues.value.push(
      {
        value: coolingOffValue.value,
        status: {
          type: 'pending',
          msg: 'Pending. The limit will change to 789 on 2022-04-19 23:44.',
        },
      },
    );
  });

  onMounted(() => {
    const main = document.querySelector('.app-main') as HTMLElement;
    main.classList.add('is-overflow-off');
  });

  onUnmounted(() => {
    const main = document.querySelector('.app-main') as HTMLElement;
    main.classList.remove('is-overflow-off');
  });
</script>

<style lang="scss">
.limits {
  width: 100%;
  user-select: none;

  &__header {
    margin: rem(8px) 0 rem(24px);

    @include media(sm) {
      display: flex;
      justify-content: space-between;
      grid-column-gap: rem(8px);
    }
  }

  &__heading {
    @include font($heading-6);
    color: var(--white);
    margin: 0;
  }

  &__mode {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
    justify-content: space-between;

    &-label {
      @include font($body-2);
      color: var(--gray-400);
    }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    grid-gap: rem(16px);
  }

  &__card {
    padding: rem(24px);
    background-color: var(--gray-900);
    border-radius: 16px;
    width: var(--card-width, 100%);

    @include media(xs) {
      --card-width: calc(50% - 8px);
    }

    &.is-full-width {
      --card-width: 100%;
    }

    &-actions {
      display: flex;
      grid-column-gap: 8px;
      justify-content: center;

      .btn-primary, .btn-secondary {
        @include font($heading-2);
        margin: rem(24px) 0 0;
        --padding: 7px 20px;
      }
    }

    &-title {
      @include font($heading-4);
      color: var(--white);
      margin: 0;
      text-align: center;
      display: flex;
      justify-content: center;
      grid-column-gap: 8px;

      .tooltip__message {
        transform: translateY(calc(-100% - 14px));
      }
    }

    &-info {
      @include font($body-1);
      color: var(--gray-400);
      margin: 16px 0 0;

      * {
        margin: 0;
      }

      a {
        color: var(--yellow-500);
        text-decoration: none;
      }

      &.is-text-center {
        text-align: center;
      }
    }

    &-dropdown {
      display: flex;
      align-items: center;
      grid-column-gap: 8px;
      margin-top: 24px;

      .selected {
        min-height: 32px;
      }

      .btn-primary {
        @include font($heading-2);
        --padding: 7px 20px;
      }
    }
  }
}
</style>
