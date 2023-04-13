<template>
  <vue-final-modal
    v-model="modals.addLimit"
    class="modal-deposit-limit"
    @clickOutside="closeModal('addLimit')"
    clickToClose
  >
    <div class="scroll">
      <pre style="color:white">{{ formState }}</pre>
      <div class="header">
        <button-modal-close @close="closeModal('addLimit')"/>
        <div class="title">{{ titleMapping[props.definition] }}</div>
      </div>

      <div class="modal-deposit-limit__tabs">
        <span
          class="modal-deposit-limit__tabs-item"
          :class="{'is-active': period.id === selectedTab.id}"
          v-for="period in limitsCashPeriod"
          :key="period.id"
          @click="changeTab(period)"
        >
          {{ period.name }}
        </span>
      </div>

      <form-input-currencies
        @select="selectCurrency"
        @blur="blurCurrencySelect"
      />

      <form-input-number
        :is-required="false"
        :currency="formState.currency"
        :min="0"
        :value="0"
        placeholder="0"
      />

      <p class="modal-deposit-limit__description">
        The restriction takes effect instantly. You can reduce your limit at any
        time, this change will take effect
        immediately. You can increase the limit, however, in order for this change to take effect, you need 24 hours.
        Cancellation of the deposit limit takes 24 hours. After the limit is exceeded, you will receive an email
        notification.</p>

      <button-base type="primary" size="md" @click="addLimit">Add</button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import { CurrencyInterface } from '@platform/frontend-core/dist/module';

  const { createPlayerLimit } = useCoreProfileApi();

  interface ModalPropsInterface {
    definition?: number | undefined,
  }

  interface PeriodInterFace {
    id: string,
    name: string,
  }

  interface FormStateInterface {
    definition: number | undefined,
    period?: string,
    currency?: string,
    amount?: number,
  }

  const props = defineProps<ModalPropsInterface>();

  const { settingsConstants } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const { closeModal } = layoutStore;
  const { modals } = storeToRefs(layoutStore);

  const limitsCashPeriod = ref(settingsConstants?.player?.limit?.cashPeriod);

  const titleMapping = {
    1: 'New wagger limit',
    2: 'New loss limit',
    3: 'New deposit limit',
  };

  const selectedTab = ref<PeriodInterFace>(limitsCashPeriod.value[0]);

  const formState = reactive<FormStateInterface>({
    definition: props.definition,
  });

  const changeTab = (period: PeriodInterFace) => {
    selectedTab.value = period;
    formState.period = period.id;
  };

  const selectCurrency = (currency: CurrencyInterface) => {
    console.log(currency);
    formState.currency = currency.code;
  };

  const blurCurrencySelect = () => {
    console.log('blur currency select');
  };

  const addLimit = async () => {
    try {
      console.log(formState);
      // await createPlayerLimit({
      //   definition: 3,
      //   period: 'daily',
      //   currency: 'USD',
      //   amount: 1,
      // });
    } catch (e) {
      console.log(e);
    }
  };

  onMounted(() => {
    // console.log(limitsCashPeriod.value);

    console.log(settingsConstants?.player?.limit?.cashPeriod);

    // formState.definition = props.definition;
  });
</script>

<style lang="scss">
.modal-deposit-limit {
  @extend %modal-info;

  .vfm__content {
    margin: 0;
  }

  .scroll {
    grid-row-gap: 0;
  }

  .header {
    .title {
      @include upd-font($heading-6);
      margin-bottom: 24px;
      margin-left: 40px;

      @include media(xs) {
        margin-left: 0;
      }
    }

    .btn-modal-close {
      transform: translate(0, 0);
      left: 0;
      --right: auto;
      --top: 0;
      --bg: var(--gray-800);

      .icon {
        &:first-of-type {
          --visibility: visible;
        }

        &:last-of-type {
          --visibility: hidden;
        }

        @include media(xs) {
          &:first-of-type {
            --visibility: hidden;
          }

          &:last-of-type {
            --visibility: visible;
          }
        }
      }

      @include media(xs) {
        --top: #{rem(-4px)};
        --right: #{rem(-14px)};
        --bg: transparent;
        left: auto;
        transform: translateY(-50%);
      }

      @include media(md) {
        --top: #{rem(-6px)};
        --right: #{rem(-14px)};
      }
    }
  }

  &__tabs {
    border-radius: 8px;
    padding: 4px;
    background-color: var(--gray-800);
    display: flex;
    align-items: center;
    grid-gap: 4px;
    margin-bottom: 24px;

    &-item {
      @include font($body-1);
      color: var(--color, var(--gray-300));
      width: 100%;
      text-align: center;
      padding: 4px;
      border-radius: 8px;
      transition: all .2s ease-in-out;
      user-select: none;

      &.is-active {
        background-color: var(--gray-700);
        --color: var(--white);
      }

      @include use-hover {
        &:not(.is-active) {
          &:hover {
            cursor: pointer;
            --color: var(--yellow-500);
          }
        }
      }
    }
  }

  &__description {
    @include font($body-1);
    color: var(--gray-400);
    margin: 24px 0 0 0;
  }

  .btn-primary {
    margin: 24px 0 0;
  }

  .field[data-maska-value="0"] {
    color: var(--gray-500);
  }

  .input-number {
    margin-top: 16px;
  }
}
</style>
