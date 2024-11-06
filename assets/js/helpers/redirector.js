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
      Location: `${self.location.protocol}//${domain}/?domainredirect=true`,
    },
  };
  return new Response('', redirectRes);
}

const checkIfFile = ({ request: { url } }) => {
  const isFile = url
    .split('/')
    .slice(3)
    .some(el => el.includes('.'));
  return isFile;
};

function makeRedirect(mainFetchResult) {
  return fetch(`https://dns.google.com/resolve?type=TXT&name=${settings.txtName}`, { cache: 'no-cache' })
    .then(res => res.clone().json())
    .then(serviceResponse => {
      const answer = serviceResponse.Answer || [];
      return answer.reduce((currentArray, currentAnswer) => {
        const parsedData = JSON.parse(atob(currentAnswer.data.replace(/"/gi, '').substr(2)));
        return parsedData ? [...currentArray, parsedData] : [...currentArray];
      }, []);
    })
    .then(dataArray => {
      if (dataArray.length) {
        const [enebled, domains] = dataArray[0];
        if (enebled && domains && domains.length) {
          return redirect(domains);
        }
      }
      return mainFetchResult;
    })
    .catch(err => {
      console.log(err);
      return mainFetchResult;
    });
}

self.addEventListener('fetch', event => {
  if (event.request.url && (event.request.url.includes('/api/') || checkIfFile(event))) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const isNotTargetRequest =
          !event.request.headers.get('accept').includes('text/html') || response.status === 404 || !response.status;

        if (isNotTargetRequest) return response;

        const cloneResponsePromise = response.clone().text();
        return cloneResponsePromise.then(body => {
          if (!checkBody(body)) return makeRedirect(response);
          return response;
        });
      })
      .catch(reason => {
        console.log('Redirector fetch failed: ', reason);
        return makeRedirect(reason);
      })
  );
});
