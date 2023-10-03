window.pwa = window.pwa || {};
window.pwa.allowInstall = false;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();

    window.pwa.originalEvent = e;
    window.pwa.allowInstall = true;
    window.pwa.install = () => {
        return e.prompt();
    }
});
