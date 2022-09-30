<template>
  <div class="input-checkbox" :class="{'has-error': props.isError, 'input-checkbox--checked': !!props.value }">
    <label class="label">
      <input
        class="checkbox"
        type="checkbox"
        :name="props.name"
        :disabled="props.isDisabled"
        :checked="!!props.value"
        @change="onChange"
      />

      <atomic-icon id="check"/>
      <p>
        <span v-html="label"/>
        <sup v-if="isRequired">*</sup>
      </p>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: [Boolean, Object],
      default: false,
    },
    label: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: '',
    },
  });

  const emit = defineEmits(['change', 'update:value']);
  const onChange = (e:any):void => {
    emit('change', e.target.checked);
    emit('update:value', e.target.checked ? 1 : '');
  };
</script>

<style lang="scss">
.input-checkbox {
  color: var(--white);
  @include font($body-2);

  .label {
    display: grid;
    grid-column-gap: rem(8px);
    grid-template-columns: auto 1fr;
    align-items: flex-start;

    &:hover {
      cursor: pointer;
    }
  }

  .checkbox {
    position: absolute;
    visibility: hidden;
  }

  span {
    margin: 0;
    color: var(--white);

    @include font($body-2);

    a {
      color: var(--yellow-500);
      text-decoration: none;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .icon {
    background-color: var(--bg, var(--gray-700));
    border-radius: 4px;
    min-width: rem(20px);
    min-height: rem(20px);
    max-width: rem(20px);
    max-height: rem(20px);
    box-shadow: var(--shadow, none);
    --color: transparent;
  }

  .label {
    @media (hover: hover) {
      &:hover {
        --shadow: 0 0 0 3px #2F363D;
      }
    }
  }

  &.input-checkbox--checked .label {
    .icon {
      --bg: var(--green-500);
      --color: var(--white);
    }

    @media (hover: hover) {
      &:hover {
        .icon {
          --bg: var(--green-700);
          --shadow: 0 0 0 3px #045518;
        }
      }
    }
  }

  .checkbox[disabled] ~ .label {
    .icon {
      --bg: var(--gray-800);
      --color: transparent;
    }
    pointer-events: none;
  }

  .checkbox[disabled]:checked ~ .label {
    .icon {
      --color: var(--gray-600);
      --shadow: none;
    }
  }

  &.has-error {
    .label {
      .icon {
        --bg: transparent;
        --color: transparent;
        box-shadow: inset 0 0 0 2px var(--red-500);
      }
    }

    &.input-checkbox--checked .label {
      .icon {
        --color: var(--white);
        --bg: var(--red-500);
      }
    }
  }

  p {
    margin: 0;
  }
}
</style>
