<template>
  <div class="card-bonus" :class="{'is-active': active}">
    <div class="content">
      <div class="title">{{ props.title }}</div>
      <form-input-toggle name="toggle" :is-checked="active" @change="select">Use currency</form-input-toggle>

      <div class="amount">
        <span class="amount">{{ props.balance.amount }}</span>
        <span class="currency">{{ props.balance.currency }}</span>
      </div>

      <button-base class="hide-currency" type="ghost" size="xs">Hide currency</button-base>

      <div v-if="active" class="actions">
        <button-base type="primary" size="md">Deposit</button-base>
        <button-base type="secondary" size="md">Withdraw</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    balance: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const active = ref<boolean>(props.isActive);
  const select = ():void => {
    active.value = !active.value;
  };
</script>

<style lang="scss">
.card-bonus {
  border-radius: 16px;
  overflow: hidden;
  position: relative;

  .title {
    @include font($body-2);
    color: var(--white);
    grid-area: title;
    position: relative;
  }

  .label {
    flex-direction: row-reverse;
    @include font($body-1);
    color: var(--white);
    grid-area: label;
    position: relative;
  }

  .amount {
    grid-area: amount;
    @include font($heading-7);
    color: var(--white);
    grid-column-gap: rem(4px);
    display: flex;
    align-items: baseline;
    position: relative;
  }

  .currency {
    @include font($body-3);
    position: relative;
  }

  .content {
    position: relative;
    height: 100%;
    background: linear-gradient(107.86deg, #1C212B 1.67%, #3D4451 87.33%);
    border-radius: inherit;
    padding: rem(26px);
    display: grid;
    grid-template-columns: 1fr minmax(0, auto);
    grid-template-areas:
      "title label"
      "amount amount"
      "actions actions";

    &:before {
      display: block;
      content: '';
      position: absolute;
      //background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA1OTggNTk3Ij48ZWxsaXBzZSBjeD0iMjk5LjIzNSIgY3k9IjI5OC44NjYiIGZpbGw9IiMxMTE0MUMiIG9wYWNpdHk9Ii4xNiIgcng9IjI5OC40NzkiIHJ5PSIyOTcuOTU2Ii8+PC9zdmc+Cg==);
      width: rem(596px);
      right: 0;
      top: 0;
      z-index: 0;
      bottom: 0;
      border-radius: 16px;
      background-position: right rem(-319px) top rem(-25px);
      background-repeat: no-repeat;
      background-size: rem(596px) rem(596px);
    }

  }

  &.is-active {
    padding: rem(2px);

    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-image: linear-gradient(89.73deg, #FFDC8A 1.37%, #FFC12E 49.58%, #E6A409 98.17%);
    }

    .content {
      padding: rem(24px);
    }
  }

  .actions {
    display: flex;
    grid-column-gap: rem(8px);
    grid-area: actions;
    position: relative;
  }

  .hide-currency {
    color: var(--gray-300);
    transform: translateX(-12px);
  }
}
</style>
