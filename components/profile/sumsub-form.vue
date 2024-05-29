<template>
  <div class="sumsub-form">
    <div id="sumsub-websdk-container" />
  </div>
</template>

<script setup lang="ts">
  import snsWebSdk from '@sumsub/websdk';
  import sha256 from 'crypto-js/sha256';
  import hmacSHA512 from 'crypto-js/hmac-sha512';
  import hex from 'crypto-js/enc-hex';

  // const launchWebSdk = () => {
  //   let snsWebSdkInstance = snsWebSdk
  //     .init(
  //       accessToken,
  //       // token update callback, must return Promise
  //       // Access token expired
  //       // get a new one and pass it to the callback to re-initiate the WebSDK
  //       () => this.getNewAccessToken()
  //     )
  //     .withConf({
  //       lang: "en", //language of WebSDK texts and comments (ISO 639-1 format)
  //       email: applicantEmail,
  //       phone: applicantPhone,
  //       theme: "dark" | "light",
  //     })
  //     .withOptions({ addViewportTag: false, adaptIframeHeight: true })
  //     // see below what kind of messages WebSDK generates
  //     .on("idCheck.onStepCompleted", (payload) => {
  //       console.log("onStepCompleted", payload);
  //     })
  //     .on("idCheck.onError", (error) => {
  //       console.log("onError", error);
  //     })
  //     .build();
  //
  //   // you are ready to go:
  //   // just launch the WebSDK by providing the container element for it
  //   snsWebSdkInstance.launch("#sumsub-websdk-container");
  // };

  const createSignature = () => {
    const profileStore = useProfileStore();
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const hashDigest = sha256(`${currentTimestamp}` + 'POST' + `/resources/accessTokens?userId=${profileStore.profile?.id}&levelName=basic-kyc-level`);
    const hmacDigest = hmacSHA512(hashDigest, 'yzQhcEA067dJvdJ5asekTBZCen2Tm4a2');
    return {
      ts: `${currentTimestamp}`,
      sig: hex.stringify(hmacDigest)
    }
  }


  const getNewAccessToken = async () => {
    const profileStore = useProfileStore();
    const { ts, sig } = createSignature();
    const { data } = await useFetch(`https://api.sumsub.com/resources/accessTokens?userId=${profileStore.profile?.id}&levelName=basic-kyc-level`, {
      method: 'POST',
      headers: {
        'X-App-Token': 'sbx:oaXJnSvyNsjIb3uveKjgsMdc.f3OFF7bxwfCq7E6zpAEWXEonxET8ZWzn',
        'X-App-Access-Sig': sig,
        'X-App-Access-Ts': ts
      }
    })

    return data
  }

  onMounted(async () => {
    const response = await getNewAccessToken();
    console.log(response);
  })
</script>

<style src="~/assets/styles/components/profile/sumsub-form.scss" lang="scss" />