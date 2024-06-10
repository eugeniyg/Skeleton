<template>
  <label class="input-copy-one-click" :for="props.name">
    <span class="input-copy-one-click__label" ref="copyLabel">{{ props.label }}</span>
    <input
        class="input-copy-one-click__field"
        readonly
        ref="copyInput"
        :value="props.value"
        :id="props.name"
        :name="props.name"
        :placeholder="props.placeholder"
        @blur="emit('blur')"
        @input="emit('input')"
        :style="{'padding-left': copyLabelWidth + 'px'}"
    />
    
    <button class="btn-copy" @click.prevent="copyValue">
      <atomic-icon id="copy"/>
    </button>
  </label>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';
  
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: ' ',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    }
  });
  
  const emit = defineEmits(['blur', 'input']);
  const copyInput = ref();
  const copyLabel = ref();
  
  const copyLabelWidth = ref<string>('');
  
  const copyValue = (): void => {
    copyInput.value.select();
    copy(props.value || '');
  };
  
  onMounted(() => {
    copyInput.value.style.paddingLeft = `${copyLabel.value?.offsetWidth}px`;
  })

</script>

<style src="~/assets/styles/components/form/input/copy-one-click.scss" lang="scss"/>

