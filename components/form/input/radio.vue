<template>
  <div class="input-radio" :class="{ 'has-error': props.isError, 'is-disabled': props.isDisabled }">
    <input
      class="radio"
      type="radio"
      :name="props.name"
      :disabled="props.isDisabled"
      :id="props.id"
      :checked="props.isChecked"
      @change="emit('change')"
    />

    <label class="label" :for="props.id">
      <atomic-icon id="radio"/>
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isChecked: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['change']);
</script>

<style lang="scss">
.input-radio {
  color: var(--white);
  @include font($body-2);
  display: flex;

  > .label {
    display: grid;
    grid-column-gap: rem(8px);
    grid-template-columns: auto 1fr;
    grid-auto-flow: column;
    align-items: center;
    --color: var(--gray-600);

    &:hover {
      cursor: pointer;
    }
  }

  .radio {
    position: absolute;
    visibility: hidden;
  }

  .icon:first-of-type {
    width: rem(20px);
    height: rem(20px);
    border-radius: 50%;
    box-shadow: var(--shadow, none);
    background-color: var(--bg, var(--gray-700));
    border: 2px solid var(--border-color, var(--gray-500));
    --color: transparent;
  }

  .radio ~ .label {
    &:hover {
      --shadow: 0 0 0 3px #2F363D;
    }
  }

  .radio:checked ~ .label {
    .icon:first-of-type {
      --color: var(--green-500);
      --bg: transparent;
      border: none;
    }

    &:hover {
      .icon:first-of-type {
        --color: var(--green-700);
        --shadow: 0 0 0 3px #2F363D;
      }
    }
  }

  .radio[disabled] ~ .label {
    .icon:first-of-type {
      --bg: var(--gray-800);
      --color: transparent;
      --border-color: var(--gray-700);
    }
    pointer-events: none;
  }

  .radio[disabled]:checked ~ .label {
    .icon:first-of-type {
      --color: var(--gray-700);
      --shadow: none;
      border: none;
    }
  }

  &.has-error {
    .radio ~ .label {
      .icon:first-of-type {
        --bg: transparent;
        --color: transparent;
        --border-color: var(--red-500);
      }
    }

    .radio:checked ~ .label {
      .icon:first-of-type {
        --color: var(--red-500);
        --bg: transparent;
      }
    }

    &:hover {
      .icon:first-of-type {
        box-shadow: none;
      }
    }
  }
}
</style>
