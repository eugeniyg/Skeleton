<template>
  <div class="input-search">
    <div class="row">
      <input
        class="field"
        type="text"
        ref="search"
        :placeholder="props.placeholder"
        :value="props.value"
        @input="onInput"
      />
      <atomic-icon id="search"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['update:value', 'input']);
  const onInput = (e:any):void => {
    emit('update:value', e.target.value);
    emit('input', e.target.value);
  };
</script>

<style lang="scss">
.input-search {
  .row {
    display: flex;
    align-items: center;
    position: relative;
  }

  .field {
    width: 100%;
    height: rem(40px);
    @include font($body-2);
    color: var(--gray-300);
    background-color: var(--bg, var(--gray-800));
    border-radius: 999px;
    border: 1px solid var(--border-color, var(--gray-800));
    padding: rem(10px) rem(16px) rem(10px) rem(44px);
    transition: all .2s ease-in-out;

    &::placeholder {
      color: var(--gray-300);
    }

    &:focus {
      --border-color: var(--gray-300);

      ~ .icon {
        --color: var(--white);
      }
    }
  }

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    align-self: center;
    width: rem(20px);
    height: rem(20px);
    left: rem(16px);

    --color: var(--gray-400);
  }
}
</style>
