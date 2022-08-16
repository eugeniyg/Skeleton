<template>
  <footer class="app-footer">
    <template v-if="isHomePage()">
      <atomic-text-wrap>
        <h2 class="heading-primary">Bitcoin Betting Flagship</h2>
        <p>Sportsbet.io is where you can find competitive odds, on a platform offering the best Bitcoin betting experience. Our team continues to work hard to give you the competitive odds, betting props and interactive experience offering you the fulfilling betting journey you've been looking for. At Sportsbet.io, we are working hard to give you the opportunity to enjoy a fun, fast and fair betting experience.</p>
        <h4 class="heading-secondary">Reliable Bitcoin Betting</h4>
        <p>Sportsbet.io takes pride in being the home of Bitcoin. Youse every single one of your Bitcoins anywhere on the site. With many options to choose from, we can assure you that you will enjoy your time in maximising your wagers with...</p>
      </atomic-text-wrap>

      <atomic-text-wrap :hide-text="true">
        <h2 class="heading-primary">Bitcoin Sportsbook with a lot to offer</h2>
        <p>From football, basketball, baseball and even the growing Esports industry, we have you covered. Sportsbet.io features more than 20 sports, and we endeavour to give you a fair chance of having a betting win by offering competitive odds for each sport.</p>
        <h4 class="heading-secondary">Limitless Betting Chances</h4>
        <p>Our sports betting platform offers an in-play option if you want to get in amongst the action or place a smart bet as the game happens. You can even browse upcoming games in our comprehensive and regularly updated list of future sporting events.</p>
        <h4 class="heading-secondary">Unique Offers</h4>
        <p>Sportsbet.io regularly offers a variety of promotions giving you more chances to increase your earnings and even better your chances of placing winning bets. From extra boosts and mystery prizes, our unique promotions help you enjoy the best betting experience!</p>
      </atomic-text-wrap>
    </template>

    <div class="group">
      <accordeon
        v-for="(key, keyIndex) in Object.keys(accordeonItems)"
        :key="keyIndex"
        v-bind="accordeonItems[key]"
        mode="toggle"
      >
        <template v-slot:header="{ heading }">
          <h4>{{ heading }}</h4>
        </template>

        <template v-slot:content="{ item }">
          <nuxt-link :to="localizePath(item.href)">{{ item.title }}</nuxt-link>
        </template>
      </accordeon>

      <list-base :items="trustIcons">
        <template #header>
          <h4>Gambling with responsibility</h4>
        </template>

        <template v-slot:item="{ item }">
          <img :src="`/img${item}`" />
        </template>
      </list-base>
    </div>

    <atomic-divider/>

    <list-paysis :items="paymentItems"/>

    <atomic-divider/>

    <!--    <div class="info">-->
    <!--      <img src="~/assets/img/info-logo.svg" />-->
    <!--      <p>Slotsbet.io is owned and operated by Company registered and established under the laws of Curacao. Company is licensed and regulated by Antillephone N.V. It is the player’s sole responsibility to inquire about the existing laws and regulations of the given jurisdiction for online gambling. Company is officially registered by the Government of Curaçao as an Information Provider, legally authorized to conduct online gaming operations from Curaçao. Remote gaming licensing and supervision is provided by Antillephone N.V. All payments with Paysafe are made via Company.</p>-->
    <!--    </div>-->

    <!--    <atomic-divider/>-->

    <div class="copy-info">
      <p>© 2022 Slotsbet.io | All Rights Reserved.</p>
      <!--      <img src="~/assets/img/copy-logo.svg" width="150" height="22" />-->
    </div>
  </footer>
</template>

<script setup lang="ts">
  const { isHomePage, localizePath } = useProjectMethods();

  // FAKE DATA
  const accordeonItems = {
    promo: {
      heading: 'Promo',
      items: [
        {
          title: 'Welcome package',
          href: '/welcome-package',
        },
        {
          title: 'Monday Reload Bonus',
          href: '/bonus/monday-reload-bonus',
        },
        {
          title: 'Wednesday Free Spins',
          href: '/bonus/wednesday-free-spins',
        },
        {
          title: 'Weekly Cashback',
          href: '/bonus/weekly-cashback',
        },
      ],
      order: 1,
      isOpen: true,
    },
    info: {
      heading: 'Info',
      items: [
        {
          title: 'T&C',
          href: '/terms-and-conditions',
        },
        {
          title: 'Bonus terms',
          href: '/bonus-terms',
        },
        {
          title: 'Privacy Policy',
          href: '/privacy-policy',
        },
        {
          title: 'Gambling with responsibility',
          href: '/gambling-with-responsibility',
        },
      ],
      order: 1,
      isOpen: true,
    },
    help: {
      heading: 'Help',
      items: [
        {
          title: 'F.A.Q',
          href: '/questions',
        },
        {
          title: 'Contact us',
          href: '/contact',
        },
      ],
      order: 1,
      isOpen: true,
    },
  };

  const trustIcons = [
    '/trust-icons/1.svg',
    '/trust-icons/2.svg',
    '/trust-icons/3.svg',
    '/trust-icons/4.svg',
  ];

  const paymentItems = [
    '/payments-icons/1.svg',
    '/payments-icons/2.svg',
    '/payments-icons/3.svg',
    '/payments-icons/4.svg',
  ];
</script>

<style lang="scss" src="./style.scss"/>
