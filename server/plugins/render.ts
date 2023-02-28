export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html) => {
        html.bodyPrepend.push('<span id="warning-container"></span>');
    });
});
