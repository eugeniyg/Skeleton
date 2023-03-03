export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        const query = getQuery(event);
        const redirectorTest = query['redirector-test'];

        if (!redirectorTest) {
            html.bodyPrepend.push('<span id="warning-container"></span>');
        }
    });
});
