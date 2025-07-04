import { defineStore } from 'pinia';

interface ILiveChatState {
  liveChatNewMessages: number;
}

interface ITokenResponse {
  expiresIn: number;
  entityId: string;
  accessToken: string;
  tokenType: string;
  creationDate: number;
  licenseId: string;
  organizationId: string;
}

export const useLiveChatStore = defineStore('liveChatStore', {
  state: (): ILiveChatState => ({
    liveChatNewMessages: 0,
  }),

  getters: {
    projectHasLiveChat() {
      const {
        public: { liveChat },
      } = useRuntimeConfig();
      return !!(liveChat?.enabled && liveChat?.license);
    },
  },

  actions: {
    hideChatAfterClose(): void {
      window.LiveChatWidget.on('visibility_changed', ({ visibility }: { visibility: string }) => {
        if (visibility === 'minimized') window.LiveChatWidget.call('hide');
      });
    },

    setChatReadyState(): void {
      window.LiveChatWidget.on('ready', () => {
        this.hideChatAfterClose();
      });
    },

    initializeLiveChat(): void {
      const {
        public: { liveChat },
      } = useRuntimeConfig();

      if (!liveChat.enabled || !liveChat.license) return;
      const scriptElement = document.createElement('script');
      scriptElement.innerHTML =
        '    window.__lc = window.__lc || {};\n' +
        `    window.__lc.license = ${liveChat.license};\n` +
        '    window.__lc.integration_name = "manual_channels";\n' +
        '    window.__lc.product_name = "livechat";\n' +
        '    window.__lc.asyncInit = true;\n' +
        '    ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can\'t use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))';
      document.body.appendChild(scriptElement);

      window.__lc.custom_identity_provider = function () {
        let tokenPromise: Promise<ITokenResponse> | null = null;
        const cacheKey = 'livechat_cache_token';
        let cachedToken: ITokenResponse | null = null;

        const fetchLiveChatToken = async (): Promise<ITokenResponse> => {
          const licenseId = liveChat.license;
          const clientId = liveChat.clientId;
          const organizationId = liveChat.organizationId;
          const entityId = undefined;
          const cst = undefined;

          const response = await $fetch.raw('https://accounts.livechat.com/customer/token', {
            method: 'POST',
            // headers: {
            //   cookie: entityId && cst ? `__lc_cid=${entityId};__lc_cst=${cst}` : '',
            // },
            body: {
              grant_type: 'cookie',
              response_type: 'token',
              client_id: clientId,
              redirect_uri: 'http://localhost',
              organization_id: organizationId,
              license_id: Number(licenseId),
            },
          });

          console.log('getToken');
          console.log(response);
          console.log(response.headers);
          console.log(response.headers.get('set-cookie'));
          // const data = await resp.json();
          // const { __lc_cst } = cookie.parse(cookie.splitCookiesString(resp.headers.get('set-cookie')!), { map: true });

          const responseData = response._data;
          const tokenResponse: ITokenResponse = {
            expiresIn: responseData.expires_in * 1000,
            entityId: responseData.entity_id,
            accessToken: responseData.access_token,
            tokenType: responseData.token_type,
            creationDate: Date.now(),
            licenseId: licenseId,
            organizationId: organizationId,
          };

          tokenPromise = null;
          window.localStorage.setItem(cacheKey, JSON.stringify(tokenResponse));
          cachedToken = tokenResponse;
          return tokenResponse;
        };

        const isTokenExpired = ({ creationDate, expiresIn }: ITokenResponse): boolean => {
          return Date.now() >= creationDate + expiresIn;
        };

        const storageToken = window.localStorage.getItem(cacheKey);
        if (storageToken) cachedToken = JSON.parse(storageToken);

        const getFreshToken = () => {
          tokenPromise = fetchLiveChatToken();
          return tokenPromise;
        };

        const getToken = () => {
          if (tokenPromise) return tokenPromise;
          if (cachedToken && !isTokenExpired(cachedToken)) return Promise.resolve(cachedToken);
          return getFreshToken();
        };

        const hasToken = () => Promise.resolve(!!cachedToken);
        const invalidate = () => {
          cachedToken = null;
          window.localStorage.removeItem(cacheKey);
        };

        return {
          getToken,
          getFreshToken,
          hasToken,
          invalidate,
        };
      };

      window.LiveChatWidget.init();
      this.setChatReadyState();
    },
  },
});
