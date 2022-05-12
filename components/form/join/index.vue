<template>
  <form class="form-join">
    <form-input-text
      type="email"
      :is-required="true"
      label="Email Address"
      name="email"
      placeholder="Enter your email"
    />

    <form-input-password
      type="password"
      :is-required="true"
      label="Enter your password"
      name="password"
      placeholder="Enter your password"
    />

    <form-dropdown-base
      label="Country"
      name="country-select"
      placeholder="Select country"
      :options="selects.country"
    />

    <form-dropdown-base
      label="Currency"
      name="currency-select"
      placeholder="Select currency"
      :options="selects.currency"
    />

    <button-ref-promo @show-promo-input="showPromoInput = true"/>

    <form-input-text
      type="text"
      label="Code (optional)"
      name="input-promo-code"
      placeholder="Enter code"
      v-show="showPromoInput"
    />

    <atomic-divider/>

    <form-input-checkbox name="accept-terms">
      <p>
        <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
      </p>
    </form-input-checkbox>

    <form-input-checkbox name="receive-bonus-emails">
      <p> I agree to receive bonus & marketing emails</p>
    </form-input-checkbox>

    <button-base type="primary" size="md">Sign up</button-base>

    <button-text-sign/>
  </form>
</template>

<script setup lang="ts">
  const { selects } = useFakeStore();
  const showPromoInput = ref<boolean>(false);
</script>

<style lang="scss" src="./style.scss"/>
