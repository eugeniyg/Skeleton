<template>
  <div ref="preloader" class="preloader">
    <div class="blobs">
      <div class="blob" />
      <div class="blob" />

      <div class="scene">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            class="logo-path"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.5039 28.7042C25.1271 28.7042 33.1077 42.2017 34.8497 39.6879C36.5917 37.1742 24.2688 24.3594 24.2688 18.9423C24.2688 13.5251 31.1597 6.17729 29.9097 5.05017C28.6596 3.92306 24.2688 11.009 16.3632 11.009C8.45771 11.009 1.5381 -2.27162 0.114756 0.340308C-1.30859 2.95224 10.9787 14.5783 10.9787 20.89C10.9787 27.2017 0.800886 32.7104 2.48984 34.733C4.1788 36.7556 9.88063 28.7042 17.5039 28.7042Z"
            fill="#FFFEFD"
          />
        </svg>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<style src="~/assets/styles/components/atomic/preloader.scss" lang="scss" />
