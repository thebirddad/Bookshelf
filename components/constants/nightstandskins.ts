const NIGHTSTAND_SKINS = [
  {
    id: 'default-1',
    name: 'Default Nightstand',
    image: require('../../assets/nightstands/nightstand-placeholder.png'),
    requirement: null, // always unlocked
  },
  {
    id: 'spooky-1',
    name: 'Spooky Nightstand',
    image: require('../../assets/nightstands/nightstand-spooky.png'),
    requirement: { genre: 'Horror', count: 5 },
  },
  {
    id: 'romantic-1',
    name: 'Romantic Nightstand',
    image: require('../../assets/nightstands/nightstand-romantic.png'),
    requirement: { genre: 'Romance', count: 5 },
  },
  {
    id: 'noir-1',
    name: 'Noir Nightstand',
    image: require('../../assets/nightstands/nightstand-noir.png'),
    requirement: { genre: 'Mystery', count: 5 }, // or 'Crime'
  },
  {
    id: 'fantasy-1',
    name: 'Fantasy Nightstand',
    image: require('../../assets/nightstands/nightstand-fantasy-1.png'),
    requirement: { genre: 'Fantasy', count: 0 },
  },
  {
    id: 'fantasy-2',
    name: 'Fantasy Nightstand',
    image: require('../../assets/nightstands/nightstand-fantasy-2.png'),
    requirement: null,
  },
  {
    id: 'fantasy-3',
    name: 'Fantasy Nightstand',
    image: require('../../assets/nightstands/nightstand-fantasy-3.png'),
    requirement: null,
  },
  {
    id: 'fantasy-4',
    name: 'Fantasy Nightstand',
    image: require('../../assets/nightstands/nightstand-fantasy-4.png'),
    requirement: null,
  },
];

export default NIGHTSTAND_SKINS;