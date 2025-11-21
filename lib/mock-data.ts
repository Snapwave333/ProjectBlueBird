export const tournaments = [
  {
    id: 1,
    name: 'The International 12',
    game: 'Dota 2',
    prizePool: '$40,000,000',
    startDate: '2024-10-12',
    teams: ['Team Secret', 'OG', 'Team Liquid', 'Evil Geniuses'],
  },
  {
    id: 2,
    name: 'League of Legends World Championship',
    game: 'League of Legends',
    prizePool: '$2,225,000',
    startDate: '2024-10-05',
    teams: ['T1', 'Gen.G', 'JD Gaming', 'DRX'],
  },
  {
    id: 3,
    name: 'Valorant Champions 2024',
    game: 'Valorant',
    prizePool: '$2,500,000',
    startDate: '2024-08-26',
    teams: ['Sentinels', 'Fnatic', 'LOUD', 'Paper Rex'],
  },
];

export const merchandise = [
  {
    id: 1,
    name: 'GameDay Logo T-Shirt',
    price: '$25.00',
    image: '/merch/t-shirt.png',
  },
  {
    id: 2,
    name: 'GameDay Hoodie',
    price: '$50.00',
    image: '/merch/hoodie.png',
  },
  {
    id: 3,
    name: 'GameDay Cap',
    price: '$20.00',
    image: '/merch/cap.png',
  },
  {
    id: 4,
    name: 'GameDay Mug',
    price: '$15.00',
    image: '/merch/mug.png',
  },
  {
    id: 5,
    name: 'GameDay Poster',
    price: '$10.00',
    image: '/merch/poster.png',
  },
];

export const users = [
  {
    id: 1,
    name: 'PlayerOne',
    bio: 'Professional Valorant player. I stream on Twitch.',
    social: {
      twitter: 'https://twitter.com/playerone',
      twitch: 'https://www.twitch.tv/playerone',
    },
    following: [2, 3],
  },
  {
    id: 2,
    name: 'GamerGirl92',
    bio: 'Casual gamer and streamer. I play a variety of games.',
    social: {
      twitter: 'https://twitter.com/gamergirl92',
      twitch: 'https://www.twitch.tv/gamergirl92',
    },
    following: [1],
  },
  {
    id: 3,
    name: 'ProGamer',
    bio: 'Dota 2 enthusiast and competitive player.',
    social: {
      twitter: 'https://twitter.com/progamer',
      twitch: 'https://www.twitch.tv/progamer',
    },
    following: [1, 2],
  },
];
