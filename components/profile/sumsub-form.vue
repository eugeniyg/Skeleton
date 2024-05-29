<template>
  <div class="sumsub-form">
    <div id="sumsub-websdk-container" />
  </div>
</template>

<script setup lang="ts">
  import snsWebSdk from '@sumsub/websdk';

  const getAccessToken = async () => {
    const { getSumsubToken } = useCoreProfileApi();
    const response = await getSumsubToken();
    return response.token;
  }

  const launchWebSdk = async () => {
    const accessToken = await getAccessToken();

    let snsWebSdkInstance = snsWebSdk
      .init(
        accessToken,
        // token update callback, must return Promise
        // Access token expired
        // get a new one and pass it to the callback to re-initiate the WebSDK
        () => getAccessToken()
      )
      // .withConf({
      //   lang: "en", //language of WebSDK texts and comments (ISO 639-1 format)
      //   email: applicantEmail,
      //   phone: applicantPhone,
      //   theme: "dark" | "light",
      // })
      // .withOptions({ addViewportTag: false, adaptIframeHeight: true })
      // // see below what kind of messages WebSDK generates
      // .on("idCheck.onStepCompleted", (payload) => {
      //   console.log("onStepCompleted", payload);
      // })
      // .on("idCheck.onError", (error) => {
      //   console.log("onError", error);
      // })
      .build();

    // you are ready to go:
    // just launch the WebSDK by providing the container element for it
    snsWebSdkInstance.launch("#sumsub-websdk-container");
  };

  onMounted(async () => {
    launchWebSdk();
  })
</script>

<style src="~/assets/styles/components/profile/sumsub-form.scss" lang="scss" />
