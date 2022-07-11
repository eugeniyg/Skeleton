export default defineEventHandler(() => ({
  topMenuItems: [
    {
      title: 'Slots',
      icon: 'slots',
    },
    {
      title: 'Recently played',
      icon: 'live-casino',
    },
    {
      title: 'Table Games',
      icon: 'table-games',
    },
    {
      title: 'Turbogames',
      icon: 'turbo-games',
      list: [
        'turbogames/crash_x.jpg',
        'turbogames/dice.jpeg',
        'turbogames/mines.jpeg',
      ],
    },
    {
      title: 'Sports',
      icon: 'sport-book',
    },
  ],
  centerMenuItems: [
    {
      title: 'Bonuses',
      icon: 'bonuses',
      items: [
        {
          title: 'Welcome package',
        },
        {
          title: 'Wednesday bonus',
        },
        {
          title: 'Reload bonus',
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
  ],
  bottomMenuItems: [
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
    },
  ],
  subMenuItems: [
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
  ],
  staticMenuItems: [
    'T&C',
    'Bonus terms',
    'Payment methods',
    'F.A.Q',
    'Privacy Policy',
    'Responsible Gaming',
  ],
  togglerBtnItems: [
    {
      icon: 'cherry',
      title: 'Casino',
      isActive: true,
    },
    {
      icon: 'sport',
      title: 'Sports',
    },
  ],
  }));
