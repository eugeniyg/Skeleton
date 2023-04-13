<template>
  <div class="limits__card">
    <h4 class="limits__card-title">{{ coolingOff.title }}</h4>

    <atomic-session-limits
      v-if="isShowCoolingOffValues"
      :items="coolingOffValues"
      @remove="removeCoolingOff"
      @back="isShowCoolingOffValues = false"
    />
    <div class="limits__card-dropdown" v-else>

      <form-input-dropdown
        name="coolingOffDropdown"
        v-model:value="coolingOffValue"
        v-bind="coolingOff.dropdown"
      />
      <button-base
        type="primary"
        :is-disabled="!coolingOffValue"
        @click="() => isShowCoolingOffValues = true"
      >{{ coolingOff.buttons.submit.title }}
      </button-base>
    </div>

    <div class="limits__card-info" v-html="coolingOff.info"/>
  </div>
</template>

<script setup lang="ts">
  const {
    profileLimits: {
      coolingOff,
    },
  } = useFakeStore();

  const coolingOffValue = ref<string>('');
  const coolingOffValues = ref<any[]>([]);
  const isShowCoolingOffValues = ref<boolean>(false);

  watch(coolingOffValue, () => {
    if (coolingOffValues.value.find((item) => item.value === coolingOffValue.value)) return;

    coolingOffValues.value.push(
      {
        value: coolingOffValue.value,
        status: {
          type: 'pending',
          msg: 'Pending. The limit will change to 789 on 2022-04-19 23:44.',
        },
      },
    );
  });

  const removeCoolingOff = () => {
    coolingOffValue.value = '';
    isShowCoolingOffValues.value = false;
    coolingOffValues.value = [];
  };
</script>
