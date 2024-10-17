<template>
  <div :class="['input-file', {'is-show-more-btn': props.showMoreButton}]">
    <input
      ref="input"
      accept="image/png, image/jpg, image/jpeg, application/pdf"
      class="input-file__input"
      type="file"
      @change="changeAction"
    >

    <div class="input-file__text">
      <h5 class="input-file__sub-title">{{ props.placeholder }}</h5>
      <p class="input-file__desc">{{ props.hint }}</p>
    </div>

    <div class="input-file__actions">
      <hr>
      <div v-if="props.showMoreButton" class="input-file__load-more">
        <button-base
          :isDisabled="props.loading"
          class="input-file__load-more-btn"
          type="secondary"
          size="xs"
          @click.prevent="clickAction"
        >
          {{ props.uploadMore }}
        </button-base>
      </div>

      <button-base
        v-else
        class="btn-select-file"
        type="secondary"
        size="xs"
        :isDisabled="props.loading"
        @click.prevent="clickAction"
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

  const input = ref<HTMLInputElement>();

  const changeAction = () => {
    emit('change', input.value?.files);
    if (input.value) input.value.value = '';
  };

  const clickAction = () => {
    input.value?.click();
  };
</script>

<style src="~/assets/styles/components/form/input/file.scss" lang="scss" />

