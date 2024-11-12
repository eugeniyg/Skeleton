export default defineEventHandler(async event => {
  if (event.context.params?.resetCode) {
    return sendRedirect(event, `/?reset-pass=true&resetCode=${event.context.params?.resetCode}`, 302);
  }
  return sendRedirect(event, '/', 302);
});
