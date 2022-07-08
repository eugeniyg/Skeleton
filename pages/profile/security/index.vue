<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">Security & Verification</h1>
    </div>

    <hr/>

    <form class="form form-change">
      <div class="row row-current">
        <form-input-password
          value=""
          type="password"
          name="password"
          label="Current password"
          placeholder="Enter your current password"
          :is-required="true"
          @submit="() => {}"
        />
      </div>

      <div class="row row-new">
        <form-input-password
          value=""
          type="password"
          name="password"
          @blur="() => {}"
          @focus="() => {}"
          @submit="() => {}"
          :is-required="true"
          label="New password"
          placeholder="Enter new password"
          :show-pass-progress="true"
        />
      </div>

      <div class="row row-re">
        <form-input-password
          value=""
          type="password"
          name="password"
          label="New password again"
          placeholder="Re-enter new password"
          :is-required="true"
          @submit="() => {}"
        />
      </div>

      <button-base
        type="primary"
        size="md"
        tagName="div"
        @click="() => {}"
        :isDisabled="true"
      >
        Save changes
      </button-base>
    </form>
  </div>
</template>

<style lang="scss" src="./style.scss"/>
