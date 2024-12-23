export default defineEventHandler(async event => {
  if (event.context.params?.confirmCode) {
    const baseURL = process.env.API_BASE_URL || '';

    try {
      await $fetch('/api/player/register/confirm', {
        baseURL,
        method: 'POST',
        body: { code: event.context.params?.confirmCode },
      });
      return sendRedirect(event, '/?profile-confirmed=true', 302);
    } catch {
      return sendRedirect(event, '/', 302);
    }
  } else return sendRedirect(event, '/', 302);
});
