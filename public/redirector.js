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
    return new Response('', redirectRes);
}

const checkIfFile = ({ request: { url } }) => {
    const isFile = url
        .split('/')
        .slice(3)
        .some((el) => el.includes('.'));
    return isFile;
};

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
    if (event.request.url && checkIfFile(event)) {
        return;
    }
    if (event.request.headers.get('range')) {
        const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(event.request.headers.get('range'));
        event.respondWith(
            fetch(event.request)
                .then((res) => res.clone())
                .then((res) => res.arrayBuffer())
                .then((arrayBuffer) => {
                    const start = Number(bytes[1]);
                    const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
                    return new Response(arrayBuffer.slice(start, end + 1), {
                        status: 206,
                        statusText: 'Partial Content',
                        headers: [
                            ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`],
                        ],
                    });
                }),
        );
    } else {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (
                        !event.request.headers.get('accept').includes('text/html')
                        || response.status === 404
                        || !response.status
                    ) {
                        return response;
                    }

                    return response
                        .clone()
                        .text()
                        .then((body) => {
                            if (!checkBody(body)) {
                                console.log('Check body failed', event, response);

                                return fetch(
                                    `https://dns.google.com/resolve?type=TXT&name=${settings.txtName}`,
                                    {
                                        cache: 'no-cache',
                                    },
                                )
                                    .then((res) => res.clone().json())
                                    .then(({ Answer = [] }) => Answer.map(({ data }) => {
                                            try {
                                                return JSON.parse(
                                                    atob(data.replace(/"/gi, '').substr(2)),
                                                );
                                            } catch (error) {
                                                console.log('decript error: ', error);
                                                return false;
                                            }
                                        }).filter(Boolean))
                                    .then((data) => {
                                        if (data.length) {
                                            const [enebled, domains] = data[0];
                                            if (enebled && domains && domains.length) {
                                                return redirect(domains);
                                            }
                                        }
                                        return response;
                                    })
                                    .catch((reason) => {
                                        console.error(reason);
                                        return response;
                                    });
                            }

                            return response;
                        });
                })
                .catch((reason) => {
                    console.log('Redirector fetch failed: ', reason);
                }),
        );
    }
});
