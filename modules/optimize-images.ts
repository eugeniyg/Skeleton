import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

export default (inlineOptions:any, nuxt:any) => {
  const nuxtHook = process.env.NODE_ENV === 'development' ? 'build:before' : 'nitro:build:public-assets';
  const destination = process.env.NODE_ENV === 'development' ? './public/img/uploads' : './.output/public/img/uploads';

  nuxt.hook(nuxtHook, async () => {
    await imagemin(['./public/img/uploads/*.{jpg,jpeg,png}'], {
      destination,
      plugins: [
        imageminWebp({ quality: 60 })
      ],
    })

    console.log('\x1B[32m✔\x1B[m' + ' Generated WEBP images!');
  });
};
