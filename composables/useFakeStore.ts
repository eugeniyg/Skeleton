export const useFakeStore = () => {
  const sliders = {
    main: [
        {
          image: {
            source: [
              {
                media: '(max-width: 360px)',
                src: ['/sliders/main/1/328/1.png', '/sliders/main/1/328/2.png'],
              },
              {
                media: '(max-width: 528px)',
                src: ['/sliders/main/1/464/1.png', '/sliders/main/1/464/2.png'],
              },
              {
                media: '(max-width: 768px)',
                src: ['/sliders/main/1/704/1.png', '/sliders/main/1/704/2.png'],
              },
              {
                media: '(max-width: 1024px)',
                src: ['/sliders/main/1/944/1.png', '/sliders/main/1/944/2.png'],
              },
              {
                media: '(max-width: 2264px)',
                src: ['/sliders/main/1/3776/1.png', '/sliders/main/1/3776/2.png'],
              },
            ],
            src: ['/sliders/main/1/944/1.png', '/sliders/main/1/944/2.png'],
          },
          title: '<h4>Welcome package <br> Get 5 BTC + 300 FS</h4>',
          actions: {
            primary: {
              title: 'Get bonus',
              href: '#',
            },
            // secondary: {
            //   title: 'Secondary',
            //   href: '#'
            // },
          },
        },
        {
          image: {
            source: [
              {
                media: '(max-width: 360px)',
                src: ['/sliders/main/2/328/1.png', '/sliders/main/2/328/2.png'],
              },
              {
                media: '(max-width: 528px)',
                src: ['/sliders/main/2/464/1.png', '/sliders/main/2/464/2.png'],
              },
              {
                media: '(max-width: 768px)',
                src: ['/sliders/main/2/704/1.png', '/sliders/main/2/704/2.png'],
              },
              {
                media: '(max-width: 1024px)',
                src: ['/sliders/main/2/944/1.png', '/sliders/main/2/944/2.png'],
              },
              {
                media: '(max-width: 2264px)',
                src: ['/sliders/main/2/3776/1.png', '/sliders/main/2/3776/2.png'],
              },
            ],
            src: ['/sliders/main/2/944/1.png', '/sliders/main/2/944/2.png'],
          },
          title: '<h5>Choose the safest crypto casino</h5>',
          list: [
            'Provably fair slots & games;',
            '24/7 Live Chat Support;',
            'Privacy and security.',
          ],
          actions: {
            primary: {
              title: 'Get bonus',
              href: '#',
            },
            // secondary: {
            //   title: 'Secondary',
            //   href: '#'
            // },
          },
        },
        {
          image: {
            source: [
              {
                media: '(max-width: 360px)',
                src: ['/sliders/main/3/328/1.png', '/sliders/main/3/328/2.png'],
              },
              {
                media: '(max-width: 528px)',
                src: ['/sliders/main/3/464/1.png', '/sliders/main/3/464/2.png'],
              },
              {
                media: '(max-width: 768px)',
                src: ['/sliders/main/3/704/1.png', '/sliders/main/3/704/2.png'],
              },
              {
                media: '(max-width: 1024px)',
                src: ['/sliders/main/3/944/1.png', '/sliders/main/3/944/2.png'],
              },
              {
                media: '(max-width: 2264px)',
                src: ['/sliders/main/3/3776/1.png', '/sliders/main/3/3776/2.png'],
              },
            ],
            src: ['/sliders/main/3/944/1.png', '/sliders/main/3/944/2.png'],
          },
          title: '<h5>Enjoy fast games on <br>Slotsbet.</h5>',
          actions: {
            primary: {
              title: 'Play now',
              href: '#',
            },
            // secondary: {
            //   title: 'Secondary',
            //   href: '#'
            // },
          },
        },
        {
          image: {
            source: [
              {
                media: '(max-width: 360px)',
                src: ['/sliders/main/4/328/1.png', '/sliders/main/4/328/2.png'],
              },
              {
                media: '(max-width: 528px)',
                src: ['/sliders/main/4/464/1.png', '/sliders/main/4/464/2.png'],
              },
              {
                media: '(max-width: 768px)',
                src: ['/sliders/main/4/704/1.png', '/sliders/main/4/704/2.png'],
              },
              {
                media: '(max-width: 1024px)',
                src: ['/sliders/main/4/944/1.png', '/sliders/main/4/944/2.png'],
              },
              {
                media: '(max-width: 2264px)',
                src: ['/sliders/main/4/3776/1.png', '/sliders/main/4/3776/2.png'],
              },
            ],
            src: ['/sliders/main/4/944/1.png', '/sliders/main/4/944/2.png'],
          },
          title: '<h5>Get bonuses every week</h5>',
          list: [
            'Provably fair slots & games;',
            '24/7 Live Chat Support;',
            'Privacy and security.',
          ],
          actions: {
            primary: {
              title: 'Get bonus',
              href: '#',
            },
            // secondary: {
            //   title: 'Secondary',
            //   href: '#'
            // },
          },
        },
      ],
  };

  const cards = [
    {
      variant: 'recomended',
      title: 'Recommended Games',
      subTitle: 'The best games for you',
      titleIcon: null,
      showAllBtn: false,
      showArrows: true,
      items: [
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
      ],
    },
    {
      variant: 'hot',
      identity: 'Hot',
      id: 'hot',
      titleIcon: 'hot',
      showAllBtn: true,
      showArrows: true,
      games: [
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
      ],
    },
    {
      variant: 'turbo',
      identity: 'Turbogames',
      titleIcon: 'turbo-games',
      id: 'turbo',
      showAllBtn: true,
      showArrows: true,
      games: [
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
      ],
    },
    {
      variant: 'recently',
      identity: 'Recently played',
      titleIcon: 'ui-history',
      id: 'recently',
      showAllBtn: false,
      showArrows: false,
      games: [
        {
          src: '/cards/card-1.jpeg',
          title: 'Spartan King',
        },
        {
          src: '/cards/card-2.jpeg',
          title: 'Warrior Ways',
        },
        {
          src: '/cards/card-3.jpeg',
          title: 'Sweet Bonanza',
        },
        {
          src: '/cards/card-1.jpeg',
          title: 'Wanted Dead or a Wild',
        },
      ],
    },
    {
      variant: 'favorites',
      identity: 'Favorites',
      id: 'favorites',
      titleIcon: 'ui-heart',
      showAllBtn: true,
      showArrows: false,
      games: [
        {
          src: '/cards/card-3.jpeg',
          title: 'Raptor Doublemax',
        },
        {
          src: '/cards/card-1.jpeg',
          title: 'Reactoonz',
        },
        {
          src: '/cards/card-2.jpeg',
          title: 'Gems Bonanza',
        },
        {
          src: '/cards/card-1.jpeg',
          title: 'Fruit Party',
        },
      ],
    },
    {
      variant: 'new-relises',
      identity: 'New Relises',
      id: 'new-relises',
      titleIcon: 'bonuses',
      showAllBtn: true,
      showArrows: true,
      games: [
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-1.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
            {
              variant: 'card-new',
              title: 'new',
            },
          ],
          showFavorite: false,
          title: 'Champions of Rome',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-2.jpeg',
          bages: [
            {
              variant: 'card-hot',
              title: 'hot',
            },
          ],
          showFavorite: false,
          title: 'Titan thunder',
          subTitle: 'Hacksaw Gaming',
        },
        {
          src: '/cards/card-3.jpeg',
          showFavorite: false,
          title: 'Gems & Stones',
          subTitle: 'Hacksaw Gaming',
        },
      ],
    },
    {
      variant: 'providers',
      identity: 'Providers',
      titleIcon: 'turbo-games',
      id: 'providers',
      showAllBtn: true,
      showArrows: true,
      games: [
        {
          src: '/providers/1.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'turbo-games',
        },
        {
          src: '/providers/2.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'one-touch',
        },
        {
          src: '/providers/3.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'blueprint-gaming',
        },
        {
          src: '/providers/4.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'betsoft',
        },
        {
          src: '/providers/5.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'wazdan',
        },
        // {
        //   src: '/providers/6.svg',
        //   showPlayBtn: false,
        //   showTryBtn: false,
        //   providerId: '9f9736ca-32f1-47cd-8c22-0ab8d8d4b23b',
        // },
        {
          src: '/providers/7.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'microgaming',
        },
        {
          src: '/providers/8.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'habanero',
        },
        {
          src: '/providers/9.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'hacksaw-gaming',
        },
        {
          src: '/providers/10.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'swintt',
        },
        {
          src: '/providers/11.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'nolimit-city',
        },
        // {
        //   src: '/providers/12.svg',
        //   showPlayBtn: false,
        //   showTryBtn: false,
        // },
        {
          src: '/providers/13.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'push-gaming',
        },
        {
          src: '/providers/14.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'playn-go',
        },
        // {
        //   src: '/providers/15.svg',
        //   showPlayBtn: false,
        //   showTryBtn: false,
        // },
        {
          src: '/providers/16.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'game-art',
        },
        // {
        //   src: '/providers/17.svg',
        //   showPlayBtn: false,
        //   showTryBtn: false,
        // },
        // {
        //   src: '/providers/18.svg',
        //   showPlayBtn: false,
        //   showTryBtn: false,
        // },
        {
          src: '/providers/19.svg',
          showPlayBtn: false,
          showTryBtn: false,
          providerId: 'pragmatic-play',
        },
      ],
    },
    {
      variant: 'latest-winners',
      identity: 'Latest winners',
      id: 'latest-winners',
      titleIcon: 'bonuses',
      showAllBtn: false,
      showArrows: false,
      games: [
        {
          src: '/latest-winners/book_of_dead.png',
          title: 'Benny',
          subTitle: 'Book Of Dead',
          items: ['0.0052', 'BTC'],
          href: '/games/9ccf90c5-a39c-45e4-b7f5-f43a604728b5',
        },
        {
          src: '/latest-winners/book_of_dead.png',
          title: 'Lukas',
          subTitle: 'Book Of Dead',
          items: ['0.0005', 'BTC'],
          href: '/games/9ccf90c5-a39c-45e4-b7f5-f43a604728b5',
        },
        {
          src: '/latest-winners/bigger_bass_bonanza.png',
          title: 'Xman',
          subTitle: 'Bigger Bass Bonanza',
          items: ['0.0077', 'BTC'],
          href: '/games/d7e2f16a-bb66-4090-a681-e68ef70b46a0',
        },
        {
          src: '/latest-winners/gold_vein.png',
          title: 'Melly',
          subTitle: 'Gold Vein',
          items: ['0.0087', 'BTC'],
          href: '/games/0bbd1ad7-a6f3-47d0-87f2-af2188550700',
        },
        {
          src: '/latest-winners/power_of_gods.png',
          title: 'Neil',
          subTitle: 'Power of Gods',
          items: ['0.0001', 'BTC'],
          href: '/games/a70c0b18-8d9d-44d6-85d6-afbbab3555f5',
        },
        {
          src: '/latest-winners/fruit_zen.png',
          title: 'giselle',
          subTitle: 'Fruit Zen',
          items: ['0.0001', 'BTC'],
          href: '/games/c1d0159a-18f8-44a7-b9be-183c0ac528a5',
        },
        {
          src: '/latest-winners/aztec_pyramids.png',
          title: 'Saichon',
          subTitle: 'Aztec Pyramids',
          items: ['0.0001', 'BTC'],
          href: '/games/3bf8e36f-1c85-4a28-98e8-c83a5799c575',
        },
        {
          src: '/latest-winners/champions_of_rome.png',
          title: 'Saichon',
          subTitle: 'Champions of Rome',
          items: ['0.0001', 'BTC'],
          href: '/games/83579a55-f8d7-4ada-b42f-9c17b0e09501',
        },
      ],
    },
    {
      variant: 'promotions',
      identity: 'Slotsbet promotions',
      titleIcon: 'bonuses',
      id: 'promotions',
      showAllBtn: false,
      showArrows: false,
      games: [
        {
          src: '/promotions/1.png',
          title: 'Welcome package',
          subTitle: '5 BTC + 300 FS',
          href: '/welcome-package',
        },
        {
          src: '/promotions/2.png',
          title: 'Wednesday bonus',
          subTitle: '100 free spins',
          href: '/wednesday-free-spins',
        },
        {
          src: '/promotions/3.png',
          title: 'Just play and get',
          subTitle: '10% Weekly Cashback',
          href: '/weekly-cashback',
        },
        {
          src: '/promotions/4.png',
          title: '30% Reload bonus',
          subTitle: 'every week',
          href: '/monday-reload-bonus',
        },
      ],
    },
    {
      variant: 'benefits',
      identity: 'Slotsbet benefits',
      titleIcon: 'bonuses',
      showAllBtn: false,
      showArrows: false,
      id: 'benefits',
      games: [
        {
          src: '/benefits/1.png',
          showFavorite: false,
          title: 'Fast <br> withdrawals',
        },
        {
          src: '/benefits/2.png',
          showFavorite: false,
          title: '24/7 Live Chat <br> Support',
        },
        {
          src: '/benefits/3.png',
          showFavorite: false,
          title: 'Provably fair slots <br> & games',
        },
        {
          src: '/benefits/4.png',
          showFavorite: false,
          title: 'Privacy <br> and security',
        },
      ],
    },
  ];

  const topMenuItems = [
    {
      title: 'Slots',
      icon: 'slots',
      href: '/games?category=slots',
    },
    {
      title: 'Live Casino',
      icon: 'live-casino',
      href: '/games?category=live',
    },
    {
      title: 'Table Games',
      icon: 'table-games',
      href: '/games?category=table',
    },
    {
      title: 'Turbogames',
      icon: 'turbo-games',
      href: '/games?category=turbogames',
      list: [
        {
          src: 'turbogames/crash_x.jpg',
          href: '/games/80a60e5b-5860-426b-8ad7-5f32c3c512b1',
        },
        {
          src: 'turbogames/dice.jpeg',
          href: '/games/f611bf81-481f-4c0d-8c4e-37c553e23936',
        },
        {
          src: 'turbogames/mines.jpeg',
          href: '/games/f9d6c988-fb51-421e-ac34-0a8876cb3066',
        },
      ],
    },
    {
      title: 'Sport betting',
      icon: 'sport-book',
      href: '/betting',
    },
  ];

  const centerMenuItems = [
    {
      title: 'Bonuses',
      icon: 'bonuses',
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
    },
    // {
    //   title: 'VIP  Program',
    //   icon: 'vip',
    //   bage: {
    //     type: 'new',
    //     text: 'new',
    //   },
    // },
    // {
    //   title: 'Tournament',
    //   icon: 'tournament',
    // },
    // {
    //   title: 'Lotteries',
    //   icon: 'lottery',
    // },
    // {
    //   title: 'Ouests',
    //   icon: 'quest',
    // },
    // {
    //   title: 'Shop',
    //   icon: 'shop',
    // },
  ];

  const bottomMenuItems = [
    // {
    //   title: 'Favorites',
    //   icon: 'ui-heart',
    //   count: 2,
    // },
    // {
    //   title: 'Recently played',
    //   icon: 'ui-history',
    //   count: 10,
    // },
    {
      title: 'Support',
      icon: 'live-support',
      href: '/contact',
    },
  ];

  const subMenuItems = [
    {
      title: 'T&C',
    },
    {
      title: 'Bonus terms',
    },
    {
      title: 'About us',
    },
    {
      title: 'Payment methods',
    },
    {
      title: 'F.A.Q',
    },
    {
      title: 'Privacy Policy',
    },
    {
      title: 'Responsible Gaming',
    },
  ];

  const staticMenuItems = [
    {
      title: 'T&C',
      href: '/terms-and-conditions',
    },
    {
      title: 'Bonus terms',
      href: '/bonus-terms',
    },
    {
      title: 'F.A.Q',
      href: '/questions',
    },
    {
      title: 'Privacy Policy',
      href: '/privacy-policy',
    },
    {
      title: 'Responsible Gaming',
      href: '/responsible-gaming',
    },
  ];

  const catNavItems = [
    {
      title: 'Casino',
      icon: 'cherry',
      href: '#',
    },
    {
      title: 'Hot',
      icon: 'hot',
      href: '#',
    },
    {
      title: 'Slots',
      icon: 'slots',
      href: '#',
    },
    {
      title: 'Table',
      icon: 'table-games',
      href: '#',
    },
    {
      title: 'New',
      icon: 'new',
      href: '#',
    },
    {
      title: 'Turbogames',
      icon: 'turbo-games',
      href: '#',
    },
    {
      title: 'Live',
      icon: 'live-casino',
      href: '#',
    },

    {
      title: 'All categories',
      icon: 'ui-more-menu',
      href: '#',
    },
  ];

  const togglerBtnItems = [
    {
      icon: 'cherry',
      title: 'Casino',
      url: '/main',
    },
    {
      icon: 'sport',
      title: 'Betting',
      url: '/betting',
    },
  ];

  const items = {
    notifications: [],
    // notifications: [
    //   {
    //     src: '/svg/colored/icn-notification.svg',
    //     title: 'Please, verify your email due to security reasons',
    //     date: 'May 14, 2019 • 19:00',
    //     isUnread: true,
    //   },
    //   {
    //     src: '/svg/colored/money.svg',
    //     title: 'Please, verify your email due to security reasons',
    //     date: 'May 14, 2019 • 19:00',
    //     isUnread: true,
    //   },
    //   {
    //     src: '/svg/colored/transaction-fail.svg',
    //     title: 'Please, verify your email due to security reasons',
    //     date: 'May 14, 2019 • 19:00',
    //     isUnread: true,
    //   },
    //   {
    //     src: '/svg/colored/transaction-fail.svg',
    //     title: 'Please, verify your email due to security reasons',
    //     date: 'May 14, 2019 • 19:00',
    //     isUnread: false,
    //   },
    // ],
  };

  const selects = {
    country: [
      {
        title: 'USA',
        value: 'USA',
        mask: '/img/flags/us.svg',
      },
      {
        title: 'USA',
        value: 'USA',
        mask: '/img/flags/us.svg',
      },
    ],
    currency: [
      {
        title: 'USD',
        value: 'USD',
      },
      {
        title: 'CAD',
        value: 'CAD',
      },
      {
        title: 'NOK',
        value: 'NOK',
      },
      {
        title: 'PLN',
        value: 'PLN',
      },
    ],
    timeZones: [
      {
        title: '(GTM +00:000) UTC',
        value: '(GTM +00:000) UTC',
      },
      {
        title: '(GTM +00:000) UTC',
        value: '(GTM +00:000) UTC',
      },
      {
        title: '(GTM +00:000) UTC',
        value: '(GTM +00:000) UTC',
      },
      {
        title: '(GTM +00:000) UTC',
        value: '(GTM +00:000) UTC',
      },
    ],
    notification: [
      {
        title: 'item 1',
        value: 'item 1',
      },
      {
        title: 'item 1',
        value: 'item 1',
      },
      {
        title: 'item 1',
        value: 'item 1',
      },
    ],
  };

  const menu = {
    profile: [
      {
        title: 'Profile info',
        href: '/profile/info',
      },
      {
        title: 'Wallet',
        href: '/profile/wallet',
      },
      {
        title: 'Bonuses',
        href: '/profile/bonuses',
        // count: 12,
      },
      {
        title: 'Notifications',
        href: '/profile/notifications',
        // count: 999,
      },
      // {
      //   title: 'Security & Verification',
      //   href: '/profile/security',
      // },
      {
        title: 'History',
        href: '/profile/history',
      },
      // {
      //   title: 'Limits',
      //   href: '/profile/limits',
      // },
    ],
    faq: [
      {
        title: 'Most popular',
        href: '/questions/most-popular',
        icon: 'hot',
      },
      {
        title: 'Account',
        href: '/questions/account',
        icon: 'ui-user',
      },
      {
        title: 'Deposits & Withdrawals',
        href: '/questions/deposits-and-withdrawals',
        icon: 'ui-wallet',
      },
      {
        title: 'Bonuses',
        href: '/questions/bonuses',
        icon: 'bonuses',
      },
      {
        title: 'Games',
        href: '/questions/games',
        icon: 'ui-gamepad',
      },
      {
        title: 'Security',
        href: '/questions/security',
        icon: 'security',
      },
      {
        title: 'Responsible Gaming',
        href: '/questions/responsible-gaming',
        icon: 'ui-18',
      },
    ],
  };

  const payments = [
    {
      title: 'Interac E-transfer',
      value: 'interac',
      mask: '/svg/payment-systems/interac.svg',
      balance: { value: 79.4, title: 'EUR' },
      withdraw: { value: 54.73, title: 'EUR' },
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'visa',
      value: 'visa',
      mask: '/svg/payment-systems/visa.svg',
      balance: { value: 79.4, title: 'EUR' },
      useForDeposit: true,
      useForWithDraw: false,
    },
    {
      title: 'MiFinity',
      value: 'mifinity',
      mask: '/svg/payment-systems/mifinity.svg',
      balance: { value: 79.4, title: 'EUR' },
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'paypal',
      value: 'paypal',
      mask: '/svg/payment-systems/paypal.svg',
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'CashToCode',
      value: 'cashtocode',
      mask: '/svg/payment-systems/3.svg',
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'USDT ERC20',
      value: 'erc20',
      mask: '/svg/payment-systems/erc20.svg',
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'skrill',
      value: 'skrill',
      mask: '/svg/payment-systems/skrill.svg',
      useForDeposit: true,
      useForWithDraw: false,
    },
    {
      title: 'sofort',
      value: 'sofort',
      mask: '/svg/payment-systems/sofort.svg',
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'volt',
      value: 'volt',
      mask: '/svg/payment-systems/volt.svg',
      balance: { value: 79.4, title: 'EUR' },
      withdraw: { value: 54.73, title: 'EUR' },
      useForDeposit: true,
      useForWithDraw: true,
    },
    {
      title: 'Bank Transfer',
      value: 'etransfer',
      mask: '/svg/payment-systems/e-transfer.svg',
      balance: { value: 100.4, title: 'EUR' },
      withdraw: { value: 77.73, title: 'EUR' },
      useForDeposit: false,
      useForWithDraw: true,
    },
    {
      title: 'CoinsPaid',
      value: 'coinspaid',
      mask: '/svg/payment-systems/coinspaid.svg',
      useForDeposit: false,
      useForWithDraw: true,
    },
  ];

  const betsHistoryTb = {
    columns: ['Game', 'Bet', 'Result', 'Date'],
    rows: [
      {
        key: 'casino',
        game: 'Game name',
        bet: '0.00000009 mBTC',
        result: '- 0.00000009 mBTC',
        date: '15.04.2022, 15:21',
      },
      {
        key: 'betting',
        game: 'Game name',
        bet: '20.00 $',
        result: '- 20.00 $',
        date: '15.04.2022, 15:21',
      },
      {
        key: 'betting',
        game: 'Game name',
        bet: '50.00 $',
        result: '-50.00 $',
        date: '15.04.2022, 15:21',
      },
      {
        key: 'casino',
        game: 'Game name',
        bet: '0.00000009 mBTC',
        result: '- 0.00000009 mBTC',
        date: '15.04.2022, 15:21',
      },
      {
        key: 'casino',
        game: 'Game name',
        bet: '0.00000009 mBTC',
        result: '- 0.00000009 mBTC',
        date: '15.04.2022, 15:21',
      },
    ],
  };

  const bonusesHistoryTb = {
    columns: ['Title', 'Status', 'Amount', 'Wager', 'Date', 'Valid until'],
    rows: [
      {
        title: 'Special 1st deposit bonus 100% + 100 FS',
        status: 'Active',
        amount: '0.00000009 mBTC',
        wager: '84%',
        date: '15.04.2022, 15:21',
        validUntil: '15.04.2022, 15:21',
      },
      {
        title: 'Special 1st deposit bonus 100% + 100 FS',
        status: 'Active',
        amount: '0.00000009 mBTC',
        wager: '84%',
        date: '15.04.2022, 15:21',
        validUntil: '15.04.2022, 15:21',
      },
      {
        title: 'Special 1st deposit bonus 100% + 100 FS',
        status: 'Active',
        amount: '0.00000009 mBTC',
        wager: '84%',
        date: '15.04.2022, 15:21',
        validUntil: '15.04.2022, 15:21',
      },
      {
        title: 'Special 1st deposit bonus 100% + 100 FS',
        status: 'Active',
        amount: '0.00000009 mBTC',
        wager: '84%',
        date: '15.04.2022, 15:21',
        validUntil: '15.04.2022, 15:21',
      },
      {
        title: 'Special 1st deposit bonus 100% + 100 FS',
        status: 'Active',
        amount: '0.00000009 mBTC',
        wager: '84%',
        date: '15.04.2022, 15:21',
        validUntil: '15.04.2022, 15:21',
      },
    ],
  };

  const sessionHistoryTb = {
    columns: [
      '&nbsp;',
      'Country',
      'User Agent',
      'Created At',
      'Status',
      '&nbsp;',
    ],
    rows: [
      {
        device: 'desktop',
        country: 'US',
        userAgent: 'Chrome on Mac OS 10',
        createdAt: '15.04.2022, 15:21',
        status: { variant: 'current', text: 'Current' },
      },
      {
        device: 'mobile',
        country: 'US',
        userAgent: 'Chrome on Mac OS 10',
        createdAt: '15.04.2022, 15:21',
        status: { variant: 'current', text: 'Current' },
      },
      {
        device: 'mobile',
        country: 'US',
        userAgent: 'Chrome on Mac OS 10',
        createdAt: '15.04.2022, 15:21',
        status: { variant: 'closed', text: 'Closed' },
      },
    ],
  };

  const transactionsHistoryTb = {
    columns: ['Date', 'Type', 'Payment Method', 'Status', 'Sum'],
    rows: [
      {
        date: '15.04.2022, 15:21',
        type: 'Withdrawal',
        paymentMethod: 'Skrill',
        status: {
          type: 'pending',
          title: 'Pending',
        },
        sum: '0.00000009 mBTC',
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Deposit',
        paymentMethod: 'Skrill',
        status: {
          type: 'success',
          title: 'Success',
        },
        sum: '0.00000009 mBTC',
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Withdrawal',
        paymentMethod: 'Skrill',
        status: {
          type: 'failed',
          title: 'Failed',
        },
        sum: '0.00000009 mBTC',
        tooltip: {
          title: 'Payment Rejected',
          text: 'A detailed description of the reason for the rejection has been sent to your email',
        },
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Deposit',
        paymentMethod: 'Skrill',
        status: {
          type: 'unfinished',
          title: 'Unfinished',
        },
        sum: '0.00000009 mBTC',
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Deposit',
        paymentMethod: 'Skrill',
        status: {
          type: 'canceled',
          title: 'Cancelled',
        },
        sum: '0.00000009 mBTC',
        tooltip: {
          title: 'Payment Rejected',
          text: 'A detailed description of the reason for the rejection has been sent to your email',
        },
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Deposit',
        paymentMethod: 'Skrill',
        status: {
          type: 'success',
          title: 'Success',
        },
        sum: '0.00000009 mBTC',
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Withdrawal',
        paymentMethod: 'Skrill',
        status: {
          type: 'failed',
          title: 'Failed',
        },
        sum: '0.00000009 mBTC',
        tooltip: {
          title: 'Payment Rejected',
          text: 'A detailed description of the reason for the rejection has been sent to your email',
        },
      },
      {
        date: '15.04.2022, 15:21',
        type: 'Deposit',
        paymentMethod: 'Skrill',
        status: {
          type: 'unfinished',
          title: 'Unfinished',
        },
        sum: '0.00000009 mBTC',
      },
    ],
  };

  const accordeons = {
    account: [
      {
        title: 'How can I create an account in the Slotsbet?',
        content: [
          '<p>All you have to do to get started is click the “Registration” button and fill in all the fields. Then you get a verification email with a link.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'Can I have more than one account?',
        content: ['<p>No. All details on Terms & Conditions.</p>'],
        isOpen: false,
      },
      {
        title: 'Can I change my registered email address?',
        content: ["<p>Sorry, but that's impossible.</p>"],
        isOpen: false,
      },
      {
        title: 'How do I add another currency to my account?',
        content: [
          '<p>Go to your account and choose "Wallet". Click on "+" and choose the currency that you prefer.</p>',
        ],
        isOpen: false,
      },
    ],
    mostPopular: [
      {
        title: 'Are the games fair?',
        content: ['<p>All games on Slotsbet are 100% fair.</p>'],
        isOpen: false,
      },
      {
        title: 'What should I do if I have forgotten my password?',
        content: [
          '<p>You can easily create a new password. Just click the Forgot Password link in the Sign in form. Then we will send an email that will direct you to a new link. There you will create a new password and log in to your account.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'Can I close my account?',
        content: [
          '<p>Of course. Please contact Customer Support in online chat and give a brief explanation to why you want to close your account.</p>',
        ],
        isOpen: false,
      },
      {
        title: "I didn't receive a confirmation email. What should I do?",
        content: [
          '<p>Check your promotions, spam or junk folder and any tabs in your inbox. If there you did not find the letter either, please contact support via online chat or email.</p>',
        ],
        isOpen: false,
      },
    ],
    depositsAndWithdrawals: [
      {
        title: 'What currencies does Slotsbet accept?',
        content: ['<p>Slotsbet accepts BTC, ETH, LTC, USDT.</p>'],
        isOpen: false,
      },
      {
        title: 'How can I choose a different currency?',
        content: ['<p>Choose required currency and tap on deposit.</p>'],
        isOpen: false,
      },
      {
        title:
          'Do I need to pay any service fees for deposits and withdrawals?',
        content: [
          '<p> It depends on the currency and the method of payment you plan to use. Some of them are free, others might charge a small fee.</p>',
        ],
        isOpen: false,
      },
      {
        title:
          "What's the minimum and maximum amount of money I can deposit and withdraw?",
        content: [
          "<p>The minimum deposit and withdrawal amount are 0.00027 BTC and it's equivalent. The maximum deposit and withdrawal depend on your payment method.</p>",
        ],
        isOpen: false,
      },
      {
        title: 'How soon can I receive my withdrawal?',
        content: [
          '<p>Usually you receive your money immediately, but it depends on the payment method.</p>',
        ],
        isOpen: false,
      },
    ],
    bonuses: [
      {
        title: 'What is a bonus?',
        content: [
          "<p>Bonuses are additional money added to your balance. It gives you an advantage and increases your chances of winning bigger amounts. But you should remember that the bonus size depends on the promotional offer's terms. So don't forget to check out our promotions and mindfully read the offer's terms.</p>",
        ],
        isOpen: false,
      },
      {
        title: 'How can I find out what the bonus wager is?',
        content: [
          '<p>Just go to your personal profile. There you can find all the information about active bonuses. And if you need any help you can always text to our support.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'How can I get my welcome bonus?',
        content: [
          '<p>The bonus will be automatically credited as soon as you make the deposit.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'How many times do I need to wager my bonus?',
        content: [
          '<p> All deposit-related bonuses have a x45 wagering requirement. For more information, please visit our <a href="/bonus-terms">Bonus Terms Page.</a></p>',
        ],
        isOpen: false,
      },
      {
        title:
          "I got my bonus, but the required bonus wager isn't decreasing. Why?",
        content: [
          '<p>Different casino games contribute differently to the wagering requirement. <a href="/bonus-terms">On the Bonus Terms Page</a> you can read more information about bonus wager.</p>',
        ],
        isOpen: false,
      },
    ],
    games: [
      {
        title: 'The game stalls in the middle of a round. What should I do?',
        content: [
          '<p>We store every single spin you make in our database in order to help with these problems. If you feel that an error has occurred during your game play, then please contact our support team.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'I can’t open a game. What should I do?',
        content: [
          '<p>We recommend relaunching the webpage, browser and/or device. If none of these helps, please contact our support team.</p>',
        ],
        isOpen: false,
      },
    ],
    security: [
      {
        title: 'Am I required to upload documents and why?',
        content: [
          '<p>You can use the website, play, and win without documents. But if you want to withdrawal your winnings, you will need to upload documents to verify your identity. We have to follow the standards set out by the Curacao licensing authority. This means that, in certain situations, we may ask our players to provide additional supporting documentation.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'Сan I edit the data in my profile?',
        content: [
          '<p>Yes, you can edit your profile information. But some fields are not editable. Please, contact our support team to change the data.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'Is my personal information secure in the Slotsbet?',
        content: [
          '<p>Please be confident that your documents and other personal data will be protected.</p>',
        ],
        isOpen: false,
      },
      {
        title:
          ' Am I required to verify my account in order to make a deposit or a withdrawal?',
        content: [
          '<p> Yes, you need to verify your account by adding personal documents for withdrawals.</p>',
        ],
        isOpen: false,
      },
      {
        title: 'How should I send my documentation?',
        content: [
          '<p>Go to the “Security & Verification” tab in your Profile. There you will find all the necessary documents. Upload documents in JPG or PNG (max size 2MB).</p>',
        ],
        isOpen: false,
      },
    ],
    responsibleGaming: [
      {
        title: 'Can I close my account for a while?',
        content: [
          '<p>Yes. If you want to close your account for a while (6-12 months), choose self-exclusion. Also, you can set a cooling-off period. You won’t be able to make deposits and play during the specified period (from 1 day to 6 months), also you will be excluded from all advertising offers. Go to the “Responsible Gambling” tab on your Profile.</p>',
        ],
      },
    ],
  };

  const categories = [
    {
      title: {
        icon: 'cherry',
        text: 'Casino',
      },
      src: '/categories/1.png',
      subTitle: 'Enjoy more than 3000+ provably fair slots & games',
      action: {
        title: 'Go to Casino',
        href: '/main',
      },
    },
    {
      title: {
        icon: 'sport',
        text: 'Betting',
      },
      src: '/categories/2.png',
      subTitle: 'The most competitive odds and markets. Bet and win right now',
      action: {
        title: 'Go to Betting',
        href: '/betting',
      },
    },
  ];

  const userProfileBonusesTabs = [
    {
      title: 'My bonuses',
      id: 'my-bonuses',
      isActive: true,
    },
    // {
    //   title: 'Bonus Code',
    //   id: 'bonus-code',
    // },
  ];

  const userProfileHistoryTabs = [
    // {
    //   title: 'Sessions history',
    //   id: 'sessions-history',
    // },
    {
      title: 'Bonuses history',
      id: 'bonuses-history',
      isActive: true,
    },
    {
      title: 'Bets history',
      id: 'bets-history',
    },
    {
      title: 'Transactions history',
      id: 'transactions-history',
      // isActive: true,
    },
  ];

  const promotion = {
    title: 'Welcome package. Up to 5 BTC + 300 Free Spins',
    subTitle: 'Welcome package is one of the most generous Slotsbet offers! It\'s a bonus bundle for your 4 initial deposits after the registration!',
    welcomePackage: {
      title: 'Welcome package',
      items: [
        {
          title: 'Get your 100% bonus up to 1.5 BTC and 100 FS.',
          subTitle: '1st deposit bonus',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/first-deposit-bonus',
            },
          },
        },
        {
          title: 'Grab your 75% bonus up to 1 BTC and 50 FS.',
          subTitle: '2nd deposit bonus',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/second-deposit-bonus',
            },
          },
        },
        {
          title: 'Take your 50% bonus up to 1 BTC and 50 FS.',
          subTitle: '3rd deposit bonus',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/third-deposit-bonus',
            },
          },
        },
        {
          title: 'Play more with 100% bonus up to 1.5 BTC and 100 FS.',
          subTitle: '4th deposit bonus',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/fourth-deposit-bonus',
            },
          },
        },
      ],
    },
    weeklyBonuses: {
      title: 'Weekly bonuses',
      items: [
        {
          title: '30% bonus of up to 0.0035 BTC on Monday',
          subTitle: 'Monday Reload Bonus',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/monday-reload-bonus',
            },
          },
        },
        {
          title: 'Get 100 Free Spins every Wednesday',
          subTitle: 'Wednesday Free Spins',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/wednesday-free-spins',
            },
          },
        },
        {
          title: 'Take your 10% cashback every Friday.',
          subTitle: 'Weekly Cashback',
          src: '/promo/drone-v2.png',
          actions: {
            primary: 'Get bonus',
            secondary: {
              title: 'More info',
              href: '/bonus/weekly-cashback',
            },
          },
        },
      ],
    },
    howToGet: {
      title: 'How to get your bonuses:',
      src: '/promo/nft_gift.png',
      items: [
        'Make a successful deposit',
        'Go to Bonuses tab and activate your Free spins',
        'Enjoy the great gaming experience!',
      ],
    },
  };

  const bonusPage = {
    src: '/promo/drone-v2.png',
    title: 'Weekly Cashback',
    subTitle: 'Take your 10% cashback every Friday.',
    description: 'Every Friday you can get a portion of your staked money back thanks to our Cashback Bonus. Receive yours!',
    list: {
      title: 'How to receive this bonus?',
      items: [
        '1. Create an account;',
        '2. Make the minimum or larger deposit as stated in the promotion;',
        '3. Find your bonus in the profile;',
        [
          '20 free spins - 0.00057 BTC;',
          '50 free spins - 0.00085 BTC;',
          '100 free spins - 0.0011 BTC;',
        ],
        '4. Contact live chat if you have questions.',
      ],
    },

    detail: {
      title: 'Bonus Terms:',
      items: [
        '1. To get the bonus, enter the bonus code WEDNESDAY before the deposit.',
        '2. Minimum deposit to get a bonus:',
        [
          '20 free spins - 0.00057 BTC;',
          '50 free spins - 0.00085 BTC;',
          '100 free spins - 0.0011 BTC;',
        ],
        '3. Full wagering requires making bets for the amount 40 times the amount of the bonus received: (winnings from free spins) ×40.',
        '4. Free spins will be automatically credited to your account!',
        '5. Limitation of the maximum bet while wagering is 0.00003 BTC.',
        '6. The bonus is available only on Wednesday from 00-00 to 23-59.',
      ],
    },
  };

  const bonusPages = {
    'first-deposit-bonus': {
      src: '/promo/drone-v2.png',
      title: '1st deposit bonus',
      subTitle: 'Get your 100% bonus up to 1.5 BTC and 100 FS',
      description: 'Slotsbet greeting you with a huge first bonus! As you’re new to us, we’re offering you a 100% up to 1.5 BTC + 100 Free Spins on your first deposit. Play in one of these games from Platipus: Cleo\'s Gold, Fruity Sevens or Arabian Tales.',
      list: {
        title: 'Getting your bonus is easy:',
        items: [
          '1. Create an account and top it up with at least 0.001 BTC.',
          '2. Instantly receive a bonus worth 100% of the amount you deposited (up to a maximum of 1.5 BTC (or the same value in other cryptocurrencies))',
          '3. Collect your 100 free spins you can find these in the Bonus section of your account.',
        ],
      },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. For getting the bonus, you must place a deposit of at least 0.001 BTC or the same value in other cryptocurrencies.',
          '2. The maximum bonus amount is 100% of the deposit amount, but not more than 1.5 BTC or the same value in other cryptocurrencies + amount of winnings obtained after the completion of the free spins.',
          '3. Full wagering requires making bets 40 times the amount of the bonus received: (deposit bonus + winnings from free spins) × 40.',
          '4. The deposit bonus is valid for 5 days, starting from the date you receive it.',
          '5. 100 free spins are available in one of these games: Cleo\'s Gold, Fruity Sevens, or Arabian Tales by Platipus. Free Spins bonus can be activated only for one chosen game. Make sure to activate your free spins in the "bonus section" in your account. Free spins can be activated for 5 days before they expire. After activation free spins are valid for 5 days. If not used, they will expire.',
          '6. 50 free spins will be given per day within two days of the day you activated the bonus.',
          '7. Please note that spins must be activated within a day.',
          '8. The maximum bet amount when wagering is 0.0003 BTC or the same value in other cryptocurrencies.',
          '9. General bonus terms and conditions apply.',
        ],
      },
    },
    'second-deposit-bonus': {
      src: '/promo/drone-v2.png',
      title: '2nd deposit bonus',
      subTitle: 'Grab your 75% bonus up to 1 BTC and 50 FS',
      description: 'Enjoy playing games with the bonus on your second deposit! We’re so happy to see you again! It looks like the time for a second deposit has come. To fill the best with Slotsbet, we are pleased to give you a bonus of 75% up to 1 BTC + 50 Free Spins on slot Elvis Frog in Vegas (BGaming) on your second deposit.',
      list: {
        title: 'The road to get the bonus:',
        items: [
          '1. Top up your account with at least 0.001 BTC.',
          '2. Instantly receive a bonus worth 75% of the amount you deposited (up to a maximum of 1 BTC (or the same value in other cryptocurrencies)).',
          '3. Collect your 50 Free Spins that you can find in the Bonus section of your account.',
        ],
      },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. To get the bonus, you must place a deposit of at least 0.001 BTC or the same value in other cryptocurrencies.',
          '2. The maximum bonus amount is 75% of the deposit amount, but not more than 1 BTC or the same value in other cryptocurrencies + amount of winnings obtained after the completion of the free spins.',
          '3. Full wagering requires making bets 40 times the amount of the bonus received: (deposit bonus + winnings from free spins) × 40.',
          '4. The deposit bonus is valid for 5 days, starting from the date you receive it.',
          '5. 50 free spins are available for the game Elvis Frog in Vegas (BGaming). Make sure to activate your free spins in the "bonus section" in your account. Free spins can be activated for 5 days before they expire. After activation free spins are valid for 5 days. If not used, they will expire.',
          '6. 25 Free Spins will be given per day within two days of the day you activated the bonus.',
          '7. Please note that spins must be activated within a day.',
          '8. The maximum bet amount when wagering is 0.0003 BTC or the same value in other cryptocurrencies.',
          '9. General bonus terms and conditions apply.',
        ],
      },
    },
    'third-deposit-bonus': {
      src: '/promo/drone-v2.png',
      title: '3rd deposit bonus',
      subTitle: 'Take your 50% bonus up to 1 BTC and 50 FS',
      description: 'Grab your chance to play on at Slotsbet with a head start, thanks to our third deposit bonus!',
      list: {
        title: 'How to get the bonus:',
        items: [
          '1. Place a deposit onto your account with at least 0.001 BTC.',
          '2. Instantly receive a 50% bonus of up to 1 BTC.',
          '3. Collect your 50 Free Spins that you can find in the Bonus section of your account.',
        ],
      },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. In order to get the bonus, you must place a deposit of at least 0.001 BTC or the same value in cryptocurrencies.',
          '2. The maximum bonus amount is 50% of the deposit amount, but not more than 1 BTC or the same value in other cryptocurrencies.',
          '3. Full wagering requires making bets 40 times the amount of the bonus received: (deposit + bonus) × 40.',
          '4. The deposit bonus is valid for 5 days, starting from the date you receive it.',
          '5. The maximum bet amount when wagering is 0.0003 BTC or the same value in other cryptocurrencies.',
          '6. 25 Free Spins will be given per day within two days of the day you activated the bonus.',
          '7. General bonus terms and conditions apply.',
        ],
      },
    },
    'fourth-deposit-bonus': {
      src: '/promo/drone-v2.png',
      title: '4th deposit bonus',
      subTitle: 'Play more with 100% bonus up to 1.5 BTC and 100 FS.',
      description: 'We will double your fourth deposit. Just play and we will do the rest for you.',
      list: {
        title: 'How to get the bonus:',
        items: [
          '1. Place a deposit onto your account with at least 0.001 BTC.',
          '2. Instantly receive a 100% bonus of up to 1.5 BTC.',
          '3. Collect your 100 Free Spins that you can find in the Bonus section of your account.',
        ],
      },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. In order to get the bonus, you must place a deposit of at least 0.001 BTC or the same value in cryptocurrencies.',
          '2. The maximum bonus amount is 100% of the deposit amount, but not more than 1.5 BTC or the same value in other cryptocurrencies.',
          '3. Full wagering requires making bets 40 times the amount of the bonus received: (deposit + bonus) × 40.',
          '4. The deposit bonus is valid for 5 days, starting from the date you receive it.',
          '5. The maximum bet amount when wagering is 0.0003 BTC or the same value in other cryptocurrencies.',
          '6. 50 Free Spins will be given per day within two days of the day you activated the bonus.',
          '7. General bonus terms and conditions apply.',
        ],
      },
    },
    'monday-reload-bonus': {
      src: '/promo/drone-v2.png',
      title: 'Monday Reload Bonus',
      subTitle: '30% bonus of up to 0.0035 BTC on Monday',
      description: 'Start your week on a high note with Slotsbet! Grabbing yourself a 30% bonus of up to 0.0035 BTC is easy:',
      list: {
        // title: 'How to get the bonus:',
        items: [
          '1. Make a deposit of at least 0.001 BTC.',
          '2. Instantly receive a bonus worth 30% of the amount you deposited (up to a maximum of 0.0035 BTC).',
        ],
      },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. To get the bonus, you must place a deposit of at least 0.001 BTC or the same value in cryptocurrencies.',
          '2. The maximum bonus amount is 30% of the deposit amount, but not more than 0.0035 BTC or the same value in cryptocurrencies.',
          '3. Full wagering requires making bets 40 times the amount of the bonus received: (deposit bonus) × 40.',
          '4. The deposit bonus is valid for 5 days, starting from the date you receive it.',
          '5. The maximum bet amount when wagering is 0.0003 BTC or the same value in cryptocurrencies.',
        ],
      },
    },
    'wednesday-free-spins': {
      src: '/promo/drone-v2.png',
      title: 'Wednesday Free Spins',
      subTitle: 'Get 100 Free Spins every Wednesday',
      description: 'On Wednesdays, our players receive either 30, 50, or 100 free spins just for making a deposit. Make sure you seize the opportunity for some Wednesday free spins when the day comes!',
      // list: {
      //   title: '',
      //   items: [],
      // },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. To get the bonus, enter the bonus code WEDNESDAY before the deposit.',
          '2. Minimum deposit to get a bonus:',
          [
            '20 free spins - 0.001 BTC;',
            '50 free spins - 0.0015 BTC;',
            '100 free spins - 0.002 BTC.',
          ],
          '3. Full wagering requires making bets for the amount 40 times the amount of the bonus received: (winnings from free spins) ×40.',
          '4. Free spins will be automatically credited to your account!',
          '5. Limitation of the maximum bet while wagering is 0.0003 BTC.',
          '6. The bonus is available only on Wednesday from 00-00 to 23-59.',
        ],
      },
    },
    'weekly-cashback': {
      src: '/promo/drone-v2.png',
      title: 'Weekly Cashback',
      subTitle: 'Take your 10% cashback every Friday.',
      description: 'Every Friday you can get a portion of your staked money back thanks to our Cashback Bonus. Receive yours!',
      list: {
        title: 'How to receive this bonus?',
        items: [
          'Create an account;',
          'Make the minimum or larger deposit as stated in the promotion;',
          'Find your bonus in the profile;',
          'Contact live chat if you have questions.',
        ],
      },
      detail: {
        title: 'Bonus Terms:',
        items: [
          '1. The promotion\'s period is from Friday 00:00 to Thursday 23:59 UTC every week. No additional opt in is required.',
          '2. This promotion is only valid for games played in the Casino section. Funds spent in other verticals (Live Casino) are not taken into account for this promotion.',
          '3. Minimum eligible cashback amount to be credited is 0.0001 BTC.',
          '4. All cashback amounts due are calculated by the formula: (total deposits during the promotional period - remaining available balance from the deposits during the promo period - total withdrawals during the promo period - total bonus credited during the promo period) x cashback % eligible at the time of request.',
          '5. Any cashback amount due must be requested in Live Chat or by email by the player on the Friday following this promotion\'s period, by 23:59 UTC. In case the customer does not request the cashback amount, any entitlement of the cashback is considered as void.',
          '6. Cashback is credited on the real balance of the customer\'s account. All credited cashback amounts are subject to a x1 wagering requirement before a withdrawal is allowed.',
        ],
      },
    },
};

  const filter = (cardsArray: any[], key: string): any[] => cardsArray.filter((item: any) => item.variant === key)[0];
  const depositItems = () => payments.filter((item) => item.useForDeposit === true);
  const withdrawItems = () => payments.filter((item) => item.useForWithDraw === true);
  const betsHistoryTbBettingItems = () => ({
    columns: betsHistoryTb.columns,
    rows: betsHistoryTb.rows.filter((item) => item.key === 'betting'),
  });
  const betsHistoryTbCasinoItems = () => ({
    columns: betsHistoryTb.columns,
    rows: betsHistoryTb.rows.filter((item) => item.key === 'casino'),
  });
  const benefitsCards = () => filter(cards, 'benefits');
  const promotionCards = () => filter(cards, 'promotions');
  const latestWinnersCards = () => filter(cards, 'latest-winners');
  const providerCards = () => filter(cards, 'providers');

  const mainBanner = {
    image: {
        source: [
          {
            media: '(max-width: 360px)',
            src: ['/sliders/main/1/328/1.png', '/sliders/main/1/328/2.png'],
          },
          {
            media: '(max-width: 528px)',
            src: ['/sliders/main/1/464/1.png', '/sliders/main/2/464/2.png'],
          },
          {
            media: '(max-width: 768px)',
            src: ['/sliders/main/1/704/1.png', '/sliders/main/1/704/2.png'],
          },
          {
            media: '(max-width: 1024px)',
            src: ['/sliders/main/1/944/1.png', '/sliders/main/1/944/2.png'],
          },
          {
            media: '(max-width: 2264px)',
            src: ['/sliders/main/1/3776/1.png', '/sliders/main/1/3776/2.png'],
          },
        ],
        src: ['/sliders/main/1/944/1.png', '/sliders/main/1/944/2.png'],
      },
    title: '<h4>Play and win every day at Slotsbet</h4>',
    actions: {
      primary: {
        title: 'Play now',
        href: '#',
      },
      // secondary: {
      //   title: 'Secondary',
      //   href: '#'
      // },
    },
  };

  return {
    topMenuItems,
    centerMenuItems,
    bottomMenuItems,
    subMenuItems,
    staticMenuItems,
    catNavItems,
    togglerBtnItems,
    items,
    selects,
    menu,
    sliders,
    promotion,
    bonusPage,
    bonusPages,
    depositItems,
    withdrawItems,
    betsHistoryTbBettingItems,
    betsHistoryTbCasinoItems,
    bonusesHistoryTb,
    sessionHistoryTb,
    transactionsHistoryTb,
    accordeons,
    categories,
    benefitsCards,
    promotionCards,
    latestWinnersCards,
    providerCards,
    userProfileBonusesTabs,
    userProfileHistoryTabs,
    mainBanner,
  };
};
