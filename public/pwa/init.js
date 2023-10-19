window.pwa = window.pwa || {};
window.pwa.allowInstall = false;

window.pwa._onInitCallbacks = [];
window.pwa.onInit = (cb) => {
    window.pwa._onInitCallbacks.push(cb);
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log('beforeinstallprompt event');

    const isFirstEvent = !window.pwa.allowInstall;
    console.log('isFirstEvent', isFirstEvent);
    window.pwa.originalEvent = e;
    window.pwa.allowInstall = true;
    window.pwa.install = () => {
        return e.prompt();
    }
    if (isFirstEvent) {
        console.log('inside first event');
        window.pwa._onInitCallbacks.forEach((cb) => {
            console.log('inside forEach');
            if (typeof cb === 'function') {
                cb();
            }
        });
    }
});
