import * as ProFingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default defineNuxtPlugin(async () => {
  const {
    public: { fingerprintApiKey, fingerprintEndpoint },
  } = useRuntimeConfig();

  let fingerprint;

  if (fingerprintApiKey) {
    fingerprint = await ProFingerprintJS.load({
      apiKey: fingerprintApiKey,
      endpoint: [fingerprintEndpoint as string, ProFingerprintJS.defaultEndpoint],
      scriptUrlPattern: [
        `${fingerprintEndpoint}/web/v<version>/<apiKey>/loader_v<loaderVersion>.js`,
        ProFingerprintJS.defaultScriptUrlPattern,
      ],
    });
  } else {
    fingerprint = await FingerprintJS.load();
  }

  return {
    provide: {
      fingerprint,
    },
  };
});
