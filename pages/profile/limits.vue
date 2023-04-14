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

      <card-deposit-limits
        v-if="isAdvancedModeEnabled"
        :limits="depositLimits"
        @open-limit-modal="openLimitModal"
      />

      <card-loss-limits :limits="lossLimits"/>

      <card-bet-limits
        :limits="betLimits"
        :definition="state.definition"
        @open-limit-modal="openLimitModal"
      />

      <card-cooling-off-limits :limits="coolingOffLimits"/>

      <card-self-exclusion-limits
        v-if="isAdvancedModeEnabled"
        :limits="selfExclusionLimits"
      />

      <modal-add-limit
        :definition="state.definition"
        :key="modalKey++"
      />
      <modal-edit-limit/>
      <modal-edit-limit-confirm/>

    </div>

  </div>
</template>

<script setup lang="ts">
  import { onMounted } from '@vue/runtime-core';
  import { storeToRefs } from 'pinia';
  import { LimitInterface } from '~/types/limits';

  const limitsStore = useLimitsStore();
  const { limits } = storeToRefs(limitsStore);

  const { showModal } = useLayoutStore();

  interface StateInterface {
    limitsList: LimitInterface[],
    definition: number | undefined,
  }

  const state = reactive<StateInterface>({
    limitsList: [],
    definition: undefined,
  });

  const modalKey = 0;

  const isAdvancedModeEnabled = ref<boolean>(true);

  const openLimitModal = (definition: number | undefined) => {
    state.definition = definition;
    showModal('addLimit');
  };

  const clickToggle = () => {
    isAdvancedModeEnabled.value = !isAdvancedModeEnabled.value;
  };

  const betLimits = computed(() => limits.value.filter((limit) => limit.definition === 1));
  const lossLimits = computed(() => limits.value.filter((limit) => limit.definition === 2));
  const depositLimits = computed(() => limits.value.filter((limit) => limit.definition === 3));
  const selfExclusionLimits = computed(() => limits.value.filter((limit) => limit.definition === 4));
  const coolingOffLimits = computed(() => limits.value.filter((limit) => limit.definition === 5));

  const addOverflowToMain = () => {
    const main = document.querySelector('.app-main') as HTMLElement;
    main.classList.add('is-overflow-off');
  };

  onUnmounted(() => {
    const main = document.querySelector('.app-main') as HTMLElement;
    main.classList.remove('is-overflow-off');
  });

  onMounted(async () => {
    try {
      addOverflowToMain();
    } catch (e) {
      console.log(e);
    }
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
