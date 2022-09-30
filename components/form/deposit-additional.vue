<template>
  <form class="form-deposit-additional">
    <atomic-titles title="Additional info" sub-title="Please fill out all required fields to make a deposit."/>

    <form-input-text
      type="text"
      label="First name"
      name="first-name"
      :is-required="true"
      placeholder="First name"
    />

    <form-input-text
      type="text"
      label="Last name"
      name="last-name"
      :is-required="true"
      placeholder="Last name"
    />

    <form-input-birth name="name2" label="Date of Birth" :is-required="true"/>

    <form-input-text
      type="text"
      label="Address"
      name="address"
      placeholder="Enter your address"
    />

    <form-input-text
      type="text"
      label="City"
      name="email"
      :is-required="true"
      placeholder="City"
    />

    <form-input-text
      type="text"
      label="Postal code"
      name="postal-code"
      :is-required="true"
      placeholder="Postal code"
    />

    <button-base type="primary" size="md">Save changes</button-base>
  </form>
</template>
