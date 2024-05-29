import { defineEventHandler, getHeader, createError } from "h3";
import { jwtDecode } from "jwt-decode";
import * as crypto from 'crypto';

// ONLY Server ENV variable
const SUMSUB_SECRET_KEY = 'yzQhcEA067dJvdJ5asekTBZCen2Tm4a2';

// Client/Server ENV variable
const SUMSUB_APP_TOKEN = 'sbx:oaXJnSvyNsjIb3uveKjgsMdc.f3OFF7bxwfCq7E6zpAEWXEonxET8ZWzn';

interface SignatureParams {
  data?: any;
  url: string;
  method: string;
  ts: number;
}

export default defineEventHandler(async (event) => {

  const header = getHeader(event, 'authorization') || '';
  const [, token] = header.split(' ', 2);

  if(!token) {
    throw createError({
      status: 401,
      message: "Unathorized",
    });
  }

  // validate expired
  const { sub } = jwtDecode(token);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const url = `/resources/accessTokens?userId=${sub}&levelName=basic-kyc-level`

  const createSignature = (config: SignatureParams): object => {
    const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    signature.update(config.ts + config.method.toUpperCase() + config.url);

    if (config.data) {
      signature.update(config.data);
    }

    return {
      'X-App-Access-Ts': config.ts,
      'X-App-Access-Sig': signature.digest('hex'),
    }
  }

  const headers = createSignature({
    url,
    method: 'POST',
    ts: currentTimestamp,
  });

  const response: any = await $fetch(`https://api.sumsub.com${url}`, {
    method: 'POST',
    headers: {
      'X-App-Token': SUMSUB_APP_TOKEN,
      ...headers,
    }
  });

  return { token: response.token };
})
