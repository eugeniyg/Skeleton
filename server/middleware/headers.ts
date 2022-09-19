export default defineEventHandler((event) => {
  event.res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
});
