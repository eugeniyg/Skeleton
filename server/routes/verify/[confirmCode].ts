import { useCoreConfirmApi } from '@platform/frontend-core';

export default defineEventHandler(async (event) => {
    console.log('Confirm Code: ', event.context.params?.confirmCode);
    if (event.context.params?.confirmCode) {
        const { confirmProfile } = useCoreConfirmApi();
        try {
            console.log('before');
            await confirmProfile(event.context.params?.confirmCode);
            console.log('after');
            return sendRedirect(event, '/?confirm=true', 302);
        } catch (err) {
            console.log('catch');
            console.log('err');
            return sendRedirect(event, '/', 302);
        }
    } else return sendRedirect(event, '/', 302);
});
