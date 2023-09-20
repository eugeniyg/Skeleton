import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

(async () => {
  const destination = (process.env.NODE_ENV === 'development') ?
      '../public/img/uploads/' :
      '../.output/public/img/uploads/';

  await imagemin(['../public/img/uploads/*.png'], {
    destination,
    plugins: [
      imageminWebp({ quality: 60 })
    ],
  })

  console.log('Done!');
})();
