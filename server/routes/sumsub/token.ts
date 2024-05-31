import { defineEventHandler, getHeader, createError } from "h3";
import { jwtDecode } from "jwt-decode";
import * as crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  const [, token] = authHeader.split(' ', 2);

  if(!token) {
    throw createError({
      status: 401,
      message: "Unauthorized",
    });
  }

  const runtimeConfig = useRuntimeConfig();
  const { sub } = jwtDecode(token);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const url = `/resources/accessTokens?userId=${sub}&levelName=basic-kyc-level`;

  const createSignature = (): object => {
    const signature = crypto.createHmac('sha256', runtimeConfig.sumsub?.secretKey);
    signature.update(currentTimestamp + 'POST' + url);

    return {
      'X-App-Access-Ts': currentTimestamp,
      'X-App-Access-Sig': signature.digest('hex'),
    }
  }

  const response: any = await $fetch(`https://api.sumsub.com${url}`, {
    method: 'POST',
    headers: {
      'X-App-Token': runtimeConfig.public.sumsub?.appToken,
      ...createSignature()
    }
  });

  return { token: response.token };
})
