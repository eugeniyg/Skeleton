<template>
  <vue-final-modal
    v-model="modals.depositLimit"
    class="modal-deposit-limit"
    clickToClose
    @clickOutside="closeModal('depositLimit')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('depositLimit')"/>
        <div class="title">New deposit limit</div>
      </div>

      <div class="modal-deposit-limit__tabs">
        <span
          class="modal-deposit-limit__tabs-item"
          :class="{'is-active': item === selectedTab}"
          v-for="item in tabs"
          :key="item"
          @click="changeTab(item)"
        >{{ item }}</span>
      </div>

      <form-input-currencies />

      <p>The restriction takes effect instantly. You can reduce your limit at any time, this change will take effect
        immediately. You can increase the limit, however, in order for this change to take effect, you need 24 hours.
        Cancellation of the deposit limit takes 24 hours. After the limit is exceeded, you will receive an email
        notification.</p>

      <button-base type="primary" size="md">Add</button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;

  const tabs = ref<string[]>(['Daily', 'Weekly', 'Monthly']);
  const selectedTab = ref<string>(tabs.value[0]);
  const changeTab = (value: string) => {
    selectedTab.value = value;
  };
</script>

<style lang="scss">
.modal-deposit-limit {
  @extend %modal-info;

  &__tabs {
    border-radius: 8px;
    padding: 4px;
    background-color: var(--gray-800);
    display: flex;
    align-items: center;
    grid-gap: 4px;

    &-item {
      @include font($body-1);
      color: var(--color, var(--gray-300));
      width: 100%;
      text-align: center;
      padding: 4px;
      border-radius: 8px;
      transition: all .2s ease-in-out;
      user-select: none;

      &.is-active {
        background-color: var(--gray-700);
        --color: var(--white);
      }

      @include use-hover {
        &:not(.is-active) {
          &:hover {
            cursor: pointer;
            --color: var(--yellow-500);
          }
        }
      }
    }
  }
}
</style>
