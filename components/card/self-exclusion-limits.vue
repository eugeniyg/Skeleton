<template>
  <div class="limits__card">
    <h2 class="limits__card-title">{{ selfExclusion.title }}</h2>

    <div class="limits__card-dropdown">
      <form-input-dropdown
        name="selfExclusionDropdown"
        v-model:value="selfExclusionValue"
        v-bind="selfExclusion.dropdown"
      />
      <button-base
        type="primary"
        :is-disabled="!selfExclusionValue"
      >{{ selfExclusion.buttons.submit.title }}
      </button-base>
    </div>

    <div class="limits__card-info" v-html="selfExclusion.info"/>
  </div>
</template>

<script setup lang="ts">
  const selfExclusionValue = ref<string>('');

  const {
    profileLimits: {
      selfExclusion,
    },
  } = useFakeStore();
</script>
