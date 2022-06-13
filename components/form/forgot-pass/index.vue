<template>
  <form class="form-forgot-pass">
    <form-input-text
      type="email"
      :is-required="true"
      label="Email Address"
      name="email"
      placeholder="Enter your email"
    />
    <button-base type="primary" size="md">Sign up</button-base>
    <button-text-join/>
  </form>
</template>

<style lang="scss" src="./style.scss"/>
