import { useCoreConfirmApi } from '@platform/frontend-core';

export default defineEventHandler(async (event) => {
    if (event.context.params?.confirmCode) {
        const { confirmProfile } = useCoreConfirmApi();
        try {
            await confirmProfile(event.context.params?.confirmCode);
            return sendRedirect(event, '/?confirm=true', 302);
        } catch (err) {
            return sendRedirect(event, '/', 302);
        }
    } else return sendRedirect(event, '/', 302);
});
