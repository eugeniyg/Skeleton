<template>
  <div
    class="input-payments"
    :class="classes"
    v-click-outside="close"
  >
    <div v-if="props.items.length" class="selected" @click="open">
      <img
        v-if="defaultLogoUrl() || props.activeMethod.logo"
        class="mask"
        :src="defaultLogoUrl() || props.activeMethod.logo"
      />
      <atomic-icon id="arrow_expand-close"/>
    </div>

    <div class="items" v-if="props.items.length">
      <div
        class="item"
        v-for="(item, i) in props.items"
        :key="i"
        :class="{'is-selected': item.method === props.activeMethod.method }"
        @click="select(item)"
      >
        <img v-if="defaultLogoUrl() || item.logo" class="mask" :src="defaultLogoUrl() || item.logo" />
      </div>
    </div>
    <input type="hidden" name="payments" :value="props.activeMethod.method" />
  </div>
</template>

<script setup lang="ts">
  import { PaymentMethodInterface } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    activeMethod: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:activeMethod']);
  const isOpen = ref<boolean>(false);

  const classes = computed(() => [
    { 'is-open': isOpen.value },
  ]);

  const select = (method: PaymentMethodInterface):void => {
    emit('update:activeMethod', method);
    isOpen.value = false;
  };

  const open = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    if (isOpen.value) isOpen.value = false;
  };

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  const defaultLogoUrl = ():string => {
    if (activeAccountType.value === 'fiat') return '/img/methods-icons/cards.svg';
    if (activeAccount.value?.currency) return `/img/methods-icons/${activeAccount.value?.currency}.svg`;
    return '';
  };
</script>

<style lang="scss">
.input-payments {
  position: relative;
  width: var(--select-width, 100%);
  outline: none;
  @include font($body-2);

  .icon {
    color: var(--icon-color, var(--gray-400));
    transform: var(--icon-transform, rotate(0));
    transition: transform .2s ease-in-out;
  }

  .selected {
    border-radius: 8px;
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    cursor: pointer;
    user-select: none;
    padding: var(--select-padding-y, rem(11px)) rem(36px) var(--select-padding-y, rem(11px)) rem(16px);
    display: flex;
    align-items: center;
    background-color: var(--bg, var(--gray-800));
    position: relative;
    transition: border-color .2s ease-in-out;
    min-height: rem(42px);
    grid-column-gap: rem(8px);

    .icon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 8px;
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .placeholder {
    color: var(--color, var(--gray-400));
  }

  .label {
    color: var(--white);
    margin-bottom: rem(8px);
    display: block;
  }

  .items {
    position: absolute;
    left: 0;
    right: 0;
    padding: var(--items-padding, #{rem(16px)});
    visibility: var(--items-visibility, hidden);
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--items-bg, var(--gray-700));
    transform: translateY(#{rem(8px)});
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    @extend %scrollbar;
    display: grid;
    //grid-template-columns: repeat(2, 1fr);
    grid-gap: rem(8px);

    @include media(md) {
      transform: none;
    }
  }

  .item {
    color: var(--color, var(--white));
    padding: rem(8px);
    cursor: pointer;
    user-select: none;
    background-color: var(--bg, var(--gray-800));
    transition: background-color .2s ease-in-out;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column-gap: rem(8px);
    border-radius: 8px;
    min-height: rem(48px);

    &.is-selected {
      box-shadow: inset 0 0 0 1px var(--white);
    }
  }

  .mask {
    max-width: 100%;
    min-height: rem(24px);
    max-height: rem(24px);
    display: flex;
    margin: auto;
  }

  .hint {
    margin-top: rem(4px);
  }

  &.is-open {
    z-index: 2;

    .selected {
      --border-color: var(--gray-300);
      --color: var(--white);
      --bg: var(--gray-700);
      --icon-transform: rotate(180deg);
      --icon-color: var(--white);
    }

    --items-visibility: visible;
  }

  &.has-error {
    --border-color: var(--red-800);

    .selected {
      --color: var(--white);
      --icon-color: var(--red-500);
    }
  }

  &.is-disabled {
    .selected {
      --border-color: var(--gray-800);
      --color: var(--gray-500);
      --bg: var(--gray-800);
      --icon-transform: rotate(0deg);
    }

    .placeholder {
      --color: var(--gray-500);
    }

    --icon-color: var(--gray-500);
  }
}
</style>
