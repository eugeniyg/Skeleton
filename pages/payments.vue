<template>
  <div class="payments">
    <div class="payments-page__title">
      <h5>Payments</h5>
    </div>
    
    <div class="payments-page__description">
      <p>Becoming a client of Slotsbet is simple: complete a short registration form, make your first deposit, and get
        access to an amazing collection of over 3000 high-quality Bitcoin casino games: Blackjack, Poker, Slots,
        Baccarat, and many more! From lottery to live dealer games, you can be sure that you are getting the very best
        thing currently available on the market.</p>
    </div>
    
    <div class="payments-page__tabs">
      <div
        class="payments-page__tabs-item"
        v-for="{id, title} in paymentsTabs"
        :key="id"
        :class="{'is-active': id === selectedPaymentsTab}"
        @click="changePaymentsTab(id)"
      >{{ title }}
      </div>
    </div>
    
    <table-payments/>
  
  </div>
</template>

<script setup lang="ts">
  const paymentsTabs = [
    {
      title: 'Deposit',
      id: 'deposit'
    },
    {
      title: 'Withdraw',
      id: 'withdraw',
    },
  ];
  
  const selectedPaymentsTab = ref<string>(paymentsTabs[0].id);
  
  const changePaymentsTab = (tabId: string): void => {
    if (selectedPaymentsTab.value === tabId) return;
    selectedPaymentsTab.value = tabId;
    //paymentsRequest();
  };
</script>

<style src="~/assets/styles/pages/payments.scss" lang="scss"/>