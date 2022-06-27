<template>
  <form class="form-reset-pass">
    <form-input-password
      type="password"
      :is-required="true"
      label="New password"
      name="password"
      placeholder="Enter your password"
      :show-pass-progress="true"
    />
    <form-input-password
      type="password"
      :is-required="true"
      label="New password again"
      name="password"
      placeholder="Re-enter new password"
      :show-pass-progress="true"
    />
    <button-base type="primary" size="md">Confirm</button-base>
  </form>
</template>

<style lang="scss" src="./style.scss"/>
