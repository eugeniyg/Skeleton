import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminWebp from 'imagemin-webp';

(async () => {
  await imagemin(['../public/img/uploads/*.{jpg,png}'], {
    destination: '../public/img/uploads',
    plugins: [
      imageminJpegtran(),
      imageminWebp({ quality: 60 })
    ],
  })

  console.log('Done!');
})();
