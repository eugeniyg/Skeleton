<template>
  <div class="search" :class="{'is-show': isShow}">
    <form-input-search
      placeholder="Search your game"
      @change="onChange"
      @ref="$emit('ref', $event)"
      @focus-out="onFocusOut"
      :query="queryString"
    />

    <list-result-search :search="queryString" :is-show="isShowSearchResult"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isShow: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
    },
  });
  const isShowSearchResult = ref<boolean>(false);
  const queryString = ref<string|null>(props.query);

  const onChange = (e:any):void => {
    const { value } = e.target;

    if (value) {
      isShowSearchResult.value = true;
      queryString.value = value;
    } else {
      isShowSearchResult.value = true;
      queryString.value = null;
    }
  };

  const emit = defineEmits(['focus-out']);

  const onFocusOut = ():void => {
    emit('focus-out');
    queryString.value = null;
    isShowSearchResult.value = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
