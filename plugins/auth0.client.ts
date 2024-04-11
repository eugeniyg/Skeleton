import { Auth0Client } from '@auth0/auth0-spa-js';

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { auth0Domain, auth0ClientId } } = useRuntimeConfig();
  if (!auth0Domain || !auth0ClientId) return;

  const auth0 = new Auth0Client({
    domain: auth0Domain as string,
    clientId: auth0ClientId as string,
    authorizationParams: {
      redirect_uri: `${origin}/auth/callback`
    }
  });

  return {
    provide: {
      auth0: auth0
    }
  }
});