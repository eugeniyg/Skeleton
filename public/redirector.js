const settings = {
  blockId: 'warning-container',
  txtName: 'redirector.slotsbet.dev.getplatform.tech',
};

function checkBody(body) {
  return body.includes(settings.blockId);
}

function redirect(domains = []) {
  const [domain] = domains;
  const redirectRes = {
    status: 302,
    statusText: 'Found',
    headers: {
      // eslint-disable-next-line no-restricted-globals
      Location: `${self.location.protocol}//${domain}/?domainredirect=true`,
    },
  };
  console.log('before redirect');
  return new Response('', redirectRes);
}

const checkIfFile = ({ request: { url } }) => {
  const isFile = url
    .split('/')
    .slice(3)
    .some((el) => el.includes('.'));
  return isFile;
};

function makeRedirect(mainFetchResult) {
  console.log('start make redirect');

  return fetch(`https://dns.google.com/resolve?type=TXT&name=${settings.txtName}`, { cache: 'no-cache' })
    .then((res) => res.clone().json())
    .then((serviceResponse) => {
      console.log('start google fetch');
      const answer = serviceResponse.Answer || [];
      return answer.reduce((currentArray, currentAnswer) => {
        const parsedData = JSON.parse(atob(currentAnswer.data.replace(/"/gi, '').substr(2)));
        return parsedData ? [...currentArray, parsedData] : [...currentArray];
      }, []);
    })
    .then((dataArray) => {
      console.log('service data:', dataArray);
      if (dataArray.length) {
        const [enebled, domains] = dataArray[0];
        if (enebled && domains && domains.length) {
          return redirect(domains);
        }
      }
      return mainFetchResult;
    })
    .catch((err) => {
      console.log(err);
      return mainFetchResult;
    });
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  console.log('run fetch listener');

  if (event.request.url && checkIfFile(event)) {
    return;
  }

  const redirectRes = {
    status: 302,
    statusText: 'Found',
    headers: {
      // eslint-disable-next-line no-restricted-globals
      Location: `${self.location.protocol}//redirector.dev.getplatform.tech/?domainredirect=true`,
    },
  };

  event.respondWith(new Response('', redirectRes));

  // event.respondWith(
  //   fetch(event.request)
  //     .then((response) => {
  //       console.log('start respond');
  //
  //       const isNotTargetRequest = !event.request.headers.get('accept').includes('text/html')
  //         || response.status === 404 || !response.status;
  //
  //       console.log('isNotTargetRequest:', isNotTargetRequest);
  //       if (isNotTargetRequest) return response;
  //
  //       const cloneResponsePromise = response.clone().text();
  //       return cloneResponsePromise.then((body) => {
  //         console.log('response body:', body);
  //         if (!checkBody(body)) return makeRedirect(response);
  //         return response;
  //       });
  //     })
  //     .catch((reason) => {
  //       console.log('Redirector fetch failed: ', reason);
  //       return makeRedirect(reason);
  //     }),
  // );
});
