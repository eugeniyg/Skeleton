<template>
  <div class="limits__card">
    <h4 class="limits__card-title">{{ sessionLimit.title }}</h4>

    <atomic-session-limits
      v-if="isShowSessionLimitValues"
      :items="sessionLimitValues"
      @remove="removeSessionLimit"
      @back="isShowSessionLimitValues = false"
    />

    <div class="limits__card-dropdown" v-else>
      <form-input-dropdown
        name="sessionLimitsDropdown"
        v-model:value="sessionLimitValue"
        v-bind="sessionLimit.dropdown"
      />
      <button-base
        type="primary"
        :is-disabled="!sessionLimitValue"
        @click="() => isShowSessionLimitValues = true"
      >{{ sessionLimit.buttons.submit.title }}
      </button-base>
    </div>

    <div class="limits__card-info" v-html="sessionLimit.info"/>
  </div>
</template>

<script setup lang="ts">
  const {
    profileLimits: {
      sessionLimit,
    },
  } = useFakeStore();

  const sessionLimitValue = ref<string>('');
  const sessionLimitValues = ref<any[]>([]);
  const isShowSessionLimitValues = ref<boolean>(false);

  const removeSessionLimit = () => {
    sessionLimitValue.value = '';
    isShowSessionLimitValues.value = false;
    sessionLimitValues.value = [];
  };

  watch(sessionLimitValue, () => {
    if (sessionLimitValues.value.find((item) => item.value === sessionLimitValue.value)) return;

    sessionLimitValues.value.push(
      {
        value: sessionLimitValue.value,
        status: {
          type: 'pending',
          msg: 'Pending. The limit will change to 789 on 2022-04-19 23:44.',
        },
      },
    );
  });

</script>
