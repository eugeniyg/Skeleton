<template>
  <div ref="input" class="input-providers">
    <button
      class="input-providers__toggle"
      @click.prevent="toggleOpen"
      :class="{'is-open': isOpen}"
    >
      <span class="input-providers__title">Providers</span>
      <span class="input-providers__count" :class="{'is-visible': count}">{{ count }}</span>
      <atomic-icon id="arrow_expand-open"/>
    </button>

    <div class="input-providers__content" ref="content">
      <div class="input-providers__list">
        <div
          class="input-providers__item"
          @click.prevent="selectAll"
          :class="{'is-checked': selectedAll}"
        >
          <span class="input-providers__title">All providers</span>
          <atomic-icon class="input-providers__checkbox" id="check"/>
        </div>
        <div v-for="provider in gameProviders" :key="provider.id" class="input-providers__item">
          <label class="input-providers__label">
            <img class="input-providers__logo" src="~/assets/svg/provider-empty-placeholder.svg" alt="">
            <span class="input-providers__title">{{ provider.name }}</span>
            <input
              type="checkbox"
              name="providers"
              v-model="inputValues[provider.id]"
              class="input-providers__input"
              @change="change"
            >
            <atomic-icon class="input-providers__checkbox" id="check"/>
          </label>
        </div>
        <div class="input-providers__clear">
          <button-base
            type="ghost"
            size="xs"
            @click.prevent="clear"
            :is-disabled="!count"
          >Clear all
          </button-base>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  const { gameProviders } = useGamesStore();

  const props = defineProps<{
    isSelectedAll?: boolean,
    value: string[]
  }>();

  const selectedAll = ref(props.isSelectedAll);
  const isOpen = ref<boolean>(false);
  const inputValues = ref<{[key:string]:boolean|undefined}>({});
  const selected = ref<string[]>([]);
  const input = ref(null);
  const content = ref<HTMLElement>();

  const emit = defineEmits(['update:value']);

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };

  const inputUnfocus = (e:any) => {
    if (!content.value?.contains(e.target) && !e.target.closest('.input-providers__toggle')) {
      isOpen.value = false;
    }
  };

  const change = ():void => {
    selected.value = Object.keys(inputValues.value).filter((key) => inputValues.value[key]);
    emit('update:value', selected.value);
    if (selected.value.length < gameProviders.length) {
      selectedAll.value = false;
    }
  };

  const selectAll = () => {
    selectedAll.value = !selectedAll.value;
    Object.values(gameProviders).forEach((provider) => {
      inputValues.value[provider.id] = selectedAll.value;
    });
    change();
  };

  const clear = () => {
    selectedAll.value = true;
    selectAll();
  };

  const count = computed(() => selected.value.length);

  onMounted(() => {
    document.addEventListener('mouseup', inputUnfocus);
  });

  onUnmounted(() => {
    document.removeEventListener('mouseup', inputUnfocus);
  });
</script>

<style lang="scss">
.input-providers {

  &__count {
    min-width: 24px;
    display: flex;
    align-items: center;
    min-height: rem(16px);
    background-color: var(--yellow-500);
    border-radius: 8px;
    color: var(--black-primary);
    padding: rem(2px) rem(8px);
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
    opacity: var(--opacity, 0);
    margin-right: rem(4px);
    transition: opacity .2s ease-in-out;

    &.is-visible {
      --opacity: 1;
    }
  }

  &__toggle {
    @extend %skip-btn;
    padding: rem(6px) rem(8px) rem(6px) rem(16px);
    background-color: var(--bg, var(--gray-800));
    border: 1px solid var(--border-color, var(--gray-800));
    display: flex;
    align-items: center;
    grid-column-gap: rem(4px);
    border-radius: 0 12px 12px 0;
    transition: all .2s ease-in-out;
    min-width: rem(150px);
    justify-content: flex-start;
    height: 100%;
    border-left-color: var(--border-left-color, var(--gray-700));

    .icon {
      width: rem(20px);
      height: rem(20px);
      --color: var(--gray-400);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: auto;
      transform: rotate(180deg);
      transition: transform .2s ease-in-out;
    }

    @media (hover:hover) {
      cursor: pointer;

      &:hover {
        --border-color: var(--gray-300);
      }
    }

    &.is-open {
      --bg: var(--gray-700);
      --border-color: var(--gray-300);
      --border-left-color: var(--gray-300);

      .icon {
        transform: rotate(0deg);
      }

      ~ .input-providers__content {
        --content-events: all;
        --content-opacity: 1;
      }
    }
  }

  &__title {
    @include font($body-1);
    color: var(--white);
    flex-grow: 1;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .input-providers__toggle & {
      flex-grow: 0;
    }
  }

  &__logo {
    width: rem(46px);
    height: rem(16px);
    display: block;
  }

  &__list {
    display: grid;
    max-height: #{rem(380px)};
    overflow-y: scroll;
    margin-right: #{rem(-4px)};

    @include scrollbar;

    @include media(sm) {
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: rem(24px);
    }

    @include media(md) {
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: rem(24px);
    }
  }

  &__item {
    padding: rem(10px) rem(8px);
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    border-bottom: 1px solid var(--gray-600);
    margin-right: 8px;
    user-select: none;

    &:first-of-type {
      cursor: pointer;
    }

    &.is-checked {
      .input-providers__checkbox {
        --color: var(--white);
        background-color: var(--green-500);
      }

      ~ .input-providers__item {
        .input-providers__checkbox {
          --color: var(--gray-600);
          background-color: transparent;
        }
      }
    }
  }

  &__checkbox {
    transition: all .2s ease-in-out;
    border-radius: 4px;
    background-color: var(--gray-700);
    --color: transparent;
  }

  &__input {
    visibility: hidden;
    position: absolute;

    &:checked ~ {
      .input-providers__checkbox {
        --color: var(--white);
        background-color: var(--green-500);
      }
    }
  }

  &__label {
    display: flex;
    align-items: center;
    flex-grow: 1;
    grid-column-gap: rem(8px);
    overflow: hidden;
    cursor: pointer;
    user-select: none;
  }

  &__content {
    position: absolute;
    left: 16px;
    right: 16px;
    top: auto;
    transform: translateY(#{rem(4px)});
    padding: rem(24px) rem(16px) rem(16px) rem(16px);
    background-color: var(--gray-800);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    max-width: rem(760px);
    pointer-events: var(--content-events, none);
    opacity: var(--content-opacity, 0);
    z-index: 1;

    @include media(sm) {
      left: auto;
    }
  }

  &__clear {
    background-color: var(--gray-800);
    margin-top: -1px;
    position: relative;
    z-index: 1;

    &:before {
      content: '';
      border-top: 1px solid var(--gray-700);
      width: 100%;
      display: block;
      height: rem(12px);
    }

    @include media(xs) {
      grid-column-start: 1;
      grid-column-end: 4;
    }
  }

  .btn-ghost {
    --width: 100%;
  }
}
</style>
