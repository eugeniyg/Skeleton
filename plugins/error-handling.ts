export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line no-param-reassign
  nuxtApp.vueApp.config.errorHandler = (error:any) => {
    console.error('Error caught in Platform Error Handling!');

    console.log(error);

    // showErrorPage();
  };
});
