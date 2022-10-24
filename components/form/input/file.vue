<template>
  <div :class="['input-file', {'is-show-more-btn': props.showMoreButton}]">

    <input
      accept=".png, .jpg, .jpeg, .pdf"
      class="input-file__input"
      ref="input"
      type="file"
      @change="changeAction"
    >

    <div class="input-file__text">
      <h5 class="input-file__sub-title">{{ props.placeholder }}</h5>
      <p class="input-file__desc">{{ props.hint }}</p>
    </div>

    <div class="input-file__actions">
      <hr/>
      <div class="input-file__load-more" v-if="props.showMoreButton">
        <button-base
          :isDisabled="props.loading"
          @click.prevent="clickAction"
          class="input-file__load-more-btn"
          type="secondary"
          size="xs"
        >
          {{ props.uploadMore }}
        </button-base>
      </div>

      <button-base
        v-else
        @click.prevent="clickAction"
        class="btn-select-file"
        type="primary"
        size="xs"
        :isDisabled="props.loading"
      >
        {{ props.uploadButton }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    placeholder?: string,
    hint?: string,
    uploadButton?: string,
    uploadMore?: string,
    showMoreButton?: boolean,
    loading: boolean
  }>();

  const emit = defineEmits(['change']);

  const input = ref(null);

  const changeAction = () => {
    emit('change', input.value.files);
    input.value.value = '';
  };

  const clickAction = () => {
    input.value.click();
  };
</script>

<style lang="scss">
.input-file {
  display: grid;
  grid-template-areas: "text" "actions";

  hr {
    display: none;
    border-top: 1px solid var(--gray-700);
    margin: 16px 0 rem(16px);
  }

  &.is-show-more-btn {
    grid-template-areas: "actions" "text";

    hr {
      display: block;
    }

    .input-file__actions {
      margin-bottom: rem(8px);
    }
  }

  &__input {
    visibility: hidden;
    position: absolute;
    clip: rect(1px 1px 1px 1px);
  }

  &__load-more {
    display: grid;
    align-items: center;
  }

  &__sub-title {
    @include font($body-0);
    color: var(--white);
    margin: 0;
    padding: 0;

    @include media(sm) {
      text-align: center;
    }
  }

  &__desc {
    @include font($body-0);
    color: var(--gray-400);
    margin: 0;
    padding: 0;

    @include media(sm) {
      text-align: center;
    }
  }

  &__text {
    grid-area: text;
  }

  &__actions {
    grid-area: actions;
  }

  &__load-more-btn {
    margin: 0 auto;
    --width: 100%;

    @include media(sm) {
      --width: fit-content;
    }
  }
}
</style>
