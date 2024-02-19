window.pwa = window.pwa || {};
window.pwa.allowInstall = false;

window.pwa._onInitCallbacks = [];
window.pwa.onInit = (cb) => {
    window.pwa._onInitCallbacks.push(cb);
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();

    const isFirstEvent = !window.pwa.allowInstall;
    window.pwa.originalEvent = e;
    window.pwa.allowInstall = true;
    window.pwa.install = () => {
        return e.prompt();
    }
    if (isFirstEvent) {
        window.pwa._onInitCallbacks.forEach((cb) => {
            if (typeof cb === 'function') {
                cb();
            }
        });
    }
});
