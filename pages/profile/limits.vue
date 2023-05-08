<template>
  <div class="limits">
    <div class="limits__header">
      <h1 class="limits__heading">{{ getContent(limitsContent, defaultLimitsContent, 'title') }}</h1>
      <div class="limits__mode">
        <span class="limits__mode-label">{{ getContent(limitsContent, defaultLimitsContent, 'modeToggle') }}</span>
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
      />

      <card-loss-limits
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
      />

      <card-bet-limits
        @open-limit-modal="openLimitModal"
        @open-edit-modal="openEditModal"
      />

      <card-cooling-off-limits />

      <card-self-exclusion-limits
        v-if="isAdvancedModeEnabled"
        @open-confirm-modal="openConfirmModal"
      />

      <modal-add-limit
        :definition="state.definition"
        :key="addModalKey"
      />

      <modal-edit-limit
        v-bind="state.editProps"
        :key="editModalKey"
      />
    </div>

    <modal-exceeded-limit-confirm/>

    <modal-confirm-limit-update
      :period="state.period"
      :key="confirmModalKey"
    />

  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileLimitsContentInterface } from '~/types';

  const limitsStore = useLimitsStore();
  const globalStore = useGlobalStore();
  const { getLimits, setLimitsContent, showModal } = limitsStore;
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { findLocalesContentData, getContent } = useProjectMethods();

  const limitsContentRequest = await useAsyncData('limitsContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'limits']).find());

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(limitsContentRequest.data.value);
  const currenctLocaleLimitsContent: Maybe<ProfileLimitsContentInterface> = currentLocaleData?.limits;
  const defaultLocaleLimitsContent: Maybe<ProfileLimitsContentInterface> = defaultLocaleData?.limits;

  setLimitsContent(currenctLocaleLimitsContent, defaultLocaleLimitsContent);

  interface EditPropsInterface {
    limitId: string|undefined,
    definition: number|undefined,
    amount: number|undefined,
    currency: string|undefined,
    period: string|undefined,
  }

  const isAdvancedModeEnabled = ref<boolean>(false);

  const state = reactive<{
    definition: number|undefined,
    editProps: EditPropsInterface,
    period: undefined|string,
  }>({
    definition: undefined,
    period: undefined,
    editProps: {
      limitId: undefined,
      definition: undefined,
      amount: undefined,
      currency: undefined,
      period: undefined,
    },
  });

  const addModalKey = ref(0);
  const editModalKey = ref(0);
  const confirmModalKey = ref(0);

  const openLimitModal = (definition: number) => {
    state.definition = definition;
    addModalKey.value += 1;
    showModal('addLimit');
  };

  const openEditModal = ({
    limitId, amount, currency, period, definition,
  }: EditPropsInterface) => {
    state.editProps.limitId = limitId;
    state.editProps.amount = amount;
    state.editProps.currency = currency;
    state.editProps.period = period;
    state.editProps.definition = definition;
    editModalKey.value += 1;
    showModal('editLimit');
  };

  const openConfirmModal = (period: string) => {
    state.period = period;
    confirmModalKey.value += 1;
    showModal('confirmLimitUpdate');
  };

  const clickToggle = () => {
    isAdvancedModeEnabled.value = !isAdvancedModeEnabled.value;
  };

  onMounted(async () => {
    await getLimits();
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
