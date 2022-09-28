<template>
  <div class="btn-copy__wrap">
    <input
      class="btn-copy__input"
      ref="input"
      :type="text"
      :value="text"
      readonly=""
    >
    <button class="btn-copy" @click="actionClick">Copy bet ID
      <atomic-icon id="ui-copy"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const input = ref(null);
  const props = defineProps({
    text: {
      type: String,
    },
  });

  const actionClick = () => {
    input.value.focus();
    input.value.select();
    document.execCommand('copy');
  };
</script>

<style lang="scss" src="./style.scss"></style>
