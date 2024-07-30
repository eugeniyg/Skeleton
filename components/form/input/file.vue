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
        type="secondary"
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

