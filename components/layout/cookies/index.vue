<template>
  <div class="cookies">
    <div class="box">
      <atomic-icon id="ui-cookies"/>
    </div>

    <div class="text" v-html="text"></div>
    <button-base type="primary" size="md" @click="acceptCookie">Accept</button-base>
  </div>
</template>

<script setup lang="ts">
  const { localizePath } = useProjectMethods();
  const text = `<p>We use cookies to improve your experience. By using our website you are accepting our <a href="${localizePath('/terms-and-conditions')}">Terms and Conditions</a> and <a href="${localizePath('/privacy-policy')}">Privacy Policy</a></p>`;

  const layoutStore = useLayoutStore();
  const acceptCookie = ():void => {
    const userCookie = useCookie('accept-cookie');
    userCookie.value = 'accepted';
    layoutStore.showCookiePopup = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
