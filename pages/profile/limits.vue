<template>
  <div class="limits">
    <div class="limits__header">
      <h1 class="limits__heading">{{ limitsContent?.title || defaultLimitsContent?.title }}</h1>
      <div class="limits__mode">
        <span class="limits__mode-label">{{ limitsContent?.modeToggle || defaultLimitsContent?.modeToggle }}</span>
        <form-input-toggle
          v-model:value="isAdvancedModeEnabled"
          name="toggle"
          @change="clickToggle"
        />
      </div>
    </div>

    <div class="limits__grid">
      <card-deposit-limits
        v-if="isAdvancedModeEnabled"
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
        @update-limits="updateLimits"
      />

      <card-loss-limits
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
        @update-limits="updateLimits"
      />

      <card-bet-limits
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
        @update-limits="updateLimits"
      />

      <!--

      <card-cooling-off-limits :limits="coolingOffLimits"/>

      <card-self-exclusion-limits
        v-if="isAdvancedModeEnabled"
        :limits="selfExclusionLimits"
      />

      -->

      <modal-add-limit
        :definition="state.definition"
        :key="addModalKey"
        @update-limits="updateLimits"
      />

      <modal-edit-limit
        v-bind="state.editProps"
        :key="editModalKey"
        @update-limits="updateLimits"
      />

      <modal-edit-limit-confirm/>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { onMounted } from '@vue/runtime-core';
  import { storeToRefs } from 'pinia';
  import { ProfileLimitsContentInterface } from '~/types';

  const limitsStore = useLimitsStore();
  const { getLimits, setLimitsContent, showModal } = limitsStore;
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { findLocalesContentData } = useProjectMethods();

  const limitsContentRequest = await useAsyncData('limitsContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'limits']).find());

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(limitsContentRequest.data.value);
  const currenctLocaleLimitsContent: Maybe<ProfileLimitsContentInterface> = currentLocaleData?.limits;
  const defaultLocaleLimitsContent: Maybe<ProfileLimitsContentInterface> = defaultLocaleData?.limits;

  setLimitsContent(currenctLocaleLimitsContent, defaultLocaleLimitsContent);

  // const { showModal } = useLayoutStore();

  interface EditPropsInterface {
    limitId?: string,
    definition?: number,
    amount?: number,
    currency?: string,
  }

  const isAdvancedModeEnabled = ref<boolean>(true);

  const state = reactive<{
    definition: number|undefined,
    editProps: EditPropsInterface
  }>({
    definition: -1,
    editProps: {},
  });

  const addModalKey = ref(0);
  const editModalKey = ref(0);

  const openLimitModal = (definition: number | undefined) => {
    state.definition = definition;
    addModalKey.value += 1;
    showModal('addLimit');
  };

  const openEditModal = ({ limitId, amount, currency }: EditPropsInterface) => {
    state.editProps.limitId = limitId;
    state.editProps.amount = amount;
    state.editProps.currency = currency;
    state.editProps.definition = state.definition;
    editModalKey.value += 1;
    showModal('editLimit');
  };

  const clickToggle = () => {
    isAdvancedModeEnabled.value = !isAdvancedModeEnabled.value;
  };

  const periodsTitles: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };

  // const transformToPeriods = (limits: PlayerLimitInterface[]) => Object.keys(periodsTitles).map((period:string) => ({
  //   title: periodsTitles[period],
  //   items: limits.filter((limit) => limit.period === period) || [],
  // })).filter((column) => column.items.length);
  //
  // const betPeriods = computed(() => {
  //   const limits = activeLimits.value.filter((limit) => limit.definition === 1);
  //   return transformToPeriods(limits) || [];
  // });

  // const lossPeriods = computed(() => {
  //   const limits = activeLimits.value.filter((limit) => limit.definition === 2);
  //   return transformToPeriods(limits) || [];
  // });

  // const depositPeriods = computed(() => {
  //   const limits = activeLimits.value.filter((limit) => limit.definition === 3);
  //   return transformToPeriods(limits) || [];
  // });

  // const selfExclusionLimits = computed(() => activeLimits.value.filter((limit) => limit.definition === 4));
  // const coolingOffLimits = computed(() => activeLimits.value.filter((limit) => limit.definition === 5));

  const addOverflowToMain = () => {
    const main = document.querySelector('.app-main') as HTMLElement;
    main.classList.add('is-overflow-off');
  };

  const removeOverflowFromMain = () => {
    const main = document.querySelector('.app-main') as HTMLElement;
    main.classList.remove('is-overflow-off');
  };

  const updateLimits = async () => {
    await getLimits();
  };

  onMounted(async () => {
    addOverflowToMain();
  });

  onUnmounted(removeOverflowFromMain);
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

    @include media(md) {
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

    &-sub-title {
      @include font($body-1-paragraph);
      color: var(--gray-400);
      margin: rem(4px) 0 0;
      text-align: center;
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
